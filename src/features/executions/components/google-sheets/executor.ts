import type { NodeExecutor } from "@/features/executions/types";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import ky from "ky";
import { googleSheetsChannel } from "@/inngest/channels/google-sheets";

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(jsonString);
});

const PERMITTED_HOST_PATTERNS = [
    /^([a-z0-9-]+\.)*script\.google\.com$/i,
    /^([a-z0-9-]+\.)*script\.googleusercontent\.com$/i,
    /^([a-z0-9-]+\.)*google\.com$/i,
    /^([a-z0-9-]+\.)*googleusercontent\.com$/i,
];

function isPrivateOrReservedHost(hostname: string): boolean {
    const host = hostname.toLowerCase().trim();

    if (
        host === "localhost" ||
        host.endsWith(".local") ||
        host.endsWith(".internal") ||
        host.endsWith(".localhost")
    ) {
        return true;
    }

    const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
        const [, oct1, oct2] = ipv4Match.map(Number);
        if (oct1 === 127) return true;
        if (oct1 === 10) return true;
        if (oct1 === 0) return true;
        if (oct1 === 169 && oct2 === 254) return true;
        if (oct1 === 172 && oct2 >= 16 && oct2 <= 31) return true;
        if (oct1 === 192 && oct2 === 168) return true;
        if (oct1 >= 224) return true;
    }

    if (host === "::1" || host === "[::1]" || host === "0:0:0:0:0:0:0:1") {
        return true;
    }

    return false;
}

function validateWebhookUrl(urlStr: string): URL {
    let parsed: URL;
    try {
        parsed = new URL(urlStr);
    } catch {
        throw new NonRetriableError(`Google Sheets Webhook Error: Invalid URL format (${urlStr})`);
    }

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        throw new NonRetriableError(`Google Sheets Webhook Error: Unsupported protocol '${parsed.protocol}'`);
    }

    const hostname = parsed.hostname;

    if (isPrivateOrReservedHost(hostname)) {
        throw new NonRetriableError(
            `Google Sheets Webhook Security Error: Destination host '${hostname}' is a reserved, loopback, or private address`
        );
    }

    const isPermitted = PERMITTED_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
    if (!isPermitted) {
        throw new NonRetriableError(
            `Google Sheets Webhook Security Error: Webhook host '${hostname}' is not an allowed destination. Only Google Apps Script domains are permitted.`
        );
    }

    return parsed;
}

async function fetchValidatedWebhook(initialUrl: string, payloadString: string): Promise<string> {
    let currentUrl = initialUrl;
    let redirectCount = 0;
    const maxRedirects = 5;

    while (redirectCount <= maxRedirects) {
        const validatedUrlObj = validateWebhookUrl(currentUrl);

        const isRedirect = redirectCount > 0;
        const options: RequestInit = {
            method: isRedirect ? "GET" : "POST",
            headers: isRedirect ? {} : { "Content-Type": "text/plain;charset=utf-8" },
            body: isRedirect ? undefined : payloadString,
            redirect: "manual",
        };

        const response = await fetch(validatedUrlObj.toString(), options);

        if ([301, 302, 303, 307, 308].includes(response.status)) {
            const location = response.headers.get("location");
            if (!location) {
                throw new NonRetriableError(
                    `Google Sheets Webhook Error: Redirect status ${response.status} returned without Location header`
                );
            }

            const nextUrl = new URL(location, validatedUrlObj).toString();
            validateWebhookUrl(nextUrl);
            currentUrl = nextUrl;
            redirectCount++;
            continue;
        }

        const textRes = await response.text();

        if (textRes.includes("accounts.google.com") || textRes.includes("Sign in")) {
            throw new NonRetriableError(
                "Google Sheets Web App Permission Error: Make sure your Web App deployment settings has 'Who has access' set to 'Anyone'."
            );
        }

        return textRes;
    }

    throw new NonRetriableError("Google Sheets Webhook Error: Exceeded maximum redirect limit");
}

type GoogleSheetsData = {
    variableName?: string;
    spreadsheetId?: string;
    sheetName?: string;
    values?: string;
    secret?: string;
    apiKey?: string;
};

export const googleSheetsExecutor: NodeExecutor<GoogleSheetsData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await publish(
        googleSheetsChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    if (!data.spreadsheetId) {
        await publish(
            googleSheetsChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Google Sheets node: Spreadsheet ID or Webhook URL is required");
    }

    if (!data.values) {
        await publish(
            googleSheetsChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Google Sheets node: Values content is required");
    }

    if (!data.variableName) {
        await publish(
            googleSheetsChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Google Sheets node: Variable name is missing");
    }

    const rawSpreadsheetId = Handlebars.compile(data.spreadsheetId)(context);
    const spreadsheetId = decode(rawSpreadsheetId).trim();

    const rawSheetName = Handlebars.compile(data.sheetName || "Sheet1")(context);
    const sheetName = decode(rawSheetName).trim();

    const rawValues = Handlebars.compile(data.values)(context);
    const valuesString = decode(rawValues).trim();

    const rawSecret = data.secret ? Handlebars.compile(data.secret)(context) : "";
    const secret = decode(rawSecret).trim();

    let parsedRow: any[] = [];
    try {
        if (valuesString.startsWith("[") && valuesString.endsWith("]")) {
            parsedRow = JSON.parse(valuesString);
        } else {
            parsedRow = valuesString.split(",").map((v) => v.trim());
        }
    } catch {
        parsedRow = [valuesString];
    }

    try {
        const result = await step.run("google-sheets-append", async () => {
            const isWebhookUrl = spreadsheetId.startsWith("http://") || spreadsheetId.startsWith("https://");

            if (isWebhookUrl) {
                let finalUrl = spreadsheetId;
                if (finalUrl.includes("script.google.com") && finalUrl.endsWith("/edit")) {
                    finalUrl = finalUrl.replace(/\/edit$/, "/exec");
                }

                if (secret) {
                    try {
                        const urlObj = new URL(finalUrl);
                        urlObj.searchParams.set("secret", secret);
                        finalUrl = urlObj.toString();
                    } catch {
                        finalUrl += (finalUrl.includes("?") ? "&" : "?") + `secret=${encodeURIComponent(secret)}`;
                    }
                }

                const payloadString = JSON.stringify({
                    sheetName,
                    values: parsedRow,
                    ...(secret ? { secret } : {}),
                });

                let resData: any = { status: "success" };

                const textRes = await fetchValidatedWebhook(finalUrl, payloadString);

                try {
                    resData = JSON.parse(textRes);
                } catch {
                    resData = { status: "success", responseText: textRes.slice(0, 500) };
                }

                return {
                    ...context,
                    [data.variableName!]: {
                        status: "success",
                        appendedValues: parsedRow,
                        response: resData,
                    },
                };
            } else {
                // Call Google Sheets API v4
                const apiKeyParam = data.apiKey ? `?valueInputOption=USER_ENTERED&key=${data.apiKey}` : `?valueInputOption=USER_ENTERED`;
                const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}:append${apiKeyParam}`;

                const res = await ky.post(apiUrl, {
                    json: {
                        range: sheetName,
                        majorDimension: "ROWS",
                        values: [parsedRow],
                    },
                }).json();

                return {
                    ...context,
                    [data.variableName!]: {
                        status: "success",
                        appendedValues: parsedRow,
                        response: res,
                    },
                };
            }
        });

        await publish(
            googleSheetsChannel().status({
                nodeId,
                status: "success",
            }),
        );

        return result;
    } catch (error) {
        await publish(
            googleSheetsChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }
};
