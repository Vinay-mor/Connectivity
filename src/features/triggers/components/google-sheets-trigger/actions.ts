"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { googleSheetsTriggerChannel } from "@/inngest/channels/google-sheets-trigger";
import crypto from "crypto";

export type GoogleSheetsTriggerToken = Realtime.Token<
    typeof googleSheetsTriggerChannel,
    ["status"]
>;

export async function fetchGoogleSheetsTriggerRealtimeToken(): Promise<GoogleSheetsTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: googleSheetsTriggerChannel(),
        topics: ["status"],
    });
    return token;
}

export async function getGoogleSheetsWebhookSecret(workflowId: string): Promise<string> {
    const serverKey = process.env.BETTER_AUTH_SECRET || process.env.ENCRYPTION_KEY || "connectivity-webhook-secret-key";
    return crypto
        .createHmac("sha256", serverKey)
        .update(workflowId)
        .digest("hex");
}

