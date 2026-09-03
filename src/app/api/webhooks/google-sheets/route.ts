import { sendWorkflowExecution } from "@/inngest/utils";
import prisma from "@/lib/db";
import { NodeType } from "@/lib/prisma-enums";
import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function safeCompare(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
        return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");

        if (!workflowId) {
            return NextResponse.json(
                { success: false, error: "Missing required query parameter: workflowId" },
                { status: 400 },
            );
        }

        const providedSecret =
            request.headers.get("x-workflow-secret") ||
            request.headers.get("x-signature") ||
            request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
            url.searchParams.get("secret") ||
            url.searchParams.get("token") ||
            url.searchParams.get("signature");

        if (!providedSecret) {
            return NextResponse.json(
                { success: false, error: "Unauthorized: Missing authorization secret or signature" },
                { status: 401 },
            );
        }

        // Verify workflow existence & authorization
        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId },
            include: {
                nodes: {
                    where: {
                        type: NodeType.GOOGLE_SHEETS_TRIGGER,
                    },
                },
            },
        });

        if (!workflow) {
            return NextResponse.json(
                { success: false, error: "Unauthorized: Workflow not found" },
                { status: 401 },
            );
        }

        const triggerNode = workflow.nodes[0];
        const nodeData = triggerNode?.data as { secret?: string; webhookSecret?: string } | undefined;
        const nodeSecret = nodeData?.secret || nodeData?.webhookSecret;
        const envSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;

        const serverKey = process.env.BETTER_AUTH_SECRET || process.env.ENCRYPTION_KEY || "connectivity-webhook-secret-key";
        const expectedHmacSecret = crypto
            .createHmac("sha256", serverKey)
            .update(workflowId)
            .digest("hex");

        const isValid =
            (nodeSecret && safeCompare(providedSecret, nodeSecret)) ||
            (envSecret && safeCompare(providedSecret, envSecret)) ||
            safeCompare(providedSecret, expectedHmacSecret);

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: "Unauthorized: Invalid authorization secret or signature" },
                { status: 401 },
            );
        }

        const body = await request.json();

        const sheetData = {
            sheetId: body.sheetId,
            sheetName: body.sheetName,
            rowNumber: body.rowNumber,
            timestamp: body.timestamp || new Date().toISOString(),
            rowValues: body.rowValues || {},
            raw: body,
        };

        // Trigger an Inngest Job only after successful authorization verification
        await sendWorkflowExecution({
            workflowId,
            initialData: {
                googleSheet: sheetData,
            },
        });

        return NextResponse.json(
            { success: true },
            { status: 200 },
        );
    } catch (error) {
        console.error("Google Sheets webhook error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process Google Sheets submission" },
            { status: 500 },
        );
    }
}

