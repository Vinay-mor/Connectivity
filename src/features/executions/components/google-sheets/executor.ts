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

type GoogleSheetsData = {
    variableName?: string;
    spreadsheetId?: string;
    sheetName?: string;
    values?: string;
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
                // Ensure URL ends with /exec if it's a Google Apps Script URL
                let finalUrl = spreadsheetId;
                if (finalUrl.includes("script.google.com") && finalUrl.endsWith("/edit")) {
                    finalUrl = finalUrl.replace(/\/edit$/, "/exec");
                }

                const payloadString = JSON.stringify({
                    sheetName,
                    values: parsedRow,
                });

                let resData: any = { status: "success" };

                try {
                    // Node.js native fetch handles Google Apps Script 302 redirects smoothly when using text/plain
                    const response = await fetch(finalUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "text/plain;charset=utf-8",
                        },
                        body: payloadString,
                        redirect: "follow",
                    });

                    const textRes = await response.text();

                    // Check if response redirected to Google accounts login page
                    if (textRes.includes("accounts.google.com") || textRes.includes("Sign in")) {
                        throw new NonRetriableError(
                            "Google Sheets Web App Permission Error: Make sure your Web App deployment settings has 'Who has access' set to 'Anyone'."
                        );
                    }

                    try {
                        resData = JSON.parse(textRes);
                    } catch {
                        resData = { status: "success", responseText: textRes.slice(0, 500) };
                    }
                } catch (fetchError: any) {
                    if (fetchError instanceof NonRetriableError) {
                        throw fetchError;
                    }

                    // Fallback to ky if native fetch failed
                    try {
                        const kyRes = await ky.post(finalUrl, {
                            body: payloadString,
                            headers: {
                                "Content-Type": "text/plain;charset=utf-8",
                            },
                            redirect: "follow",
                        }).text();

                        try {
                            resData = JSON.parse(kyRes);
                        } catch {
                            resData = { status: "success", responseText: kyRes.slice(0, 500) };
                        }
                    } catch (kyError: any) {
                        throw new NonRetriableError(
                            `Google Sheets Webhook Failed: ${kyError.message || fetchError.message || "Network Error"}. Please verify your Web App URL and set deployment access to 'Anyone'.`
                        );
                    }
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
