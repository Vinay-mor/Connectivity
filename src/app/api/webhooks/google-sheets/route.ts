import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

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

        const body = await request.json();

        const sheetData = {
            sheetId: body.sheetId,
            sheetName: body.sheetName,
            rowNumber: body.rowNumber,
            timestamp: body.timestamp || new Date().toISOString(),
            rowValues: body.rowValues || {},
            raw: body,
        };

        // Trigger an Inngest Job
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
