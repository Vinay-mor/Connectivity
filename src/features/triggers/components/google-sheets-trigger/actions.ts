"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { googleSheetsTriggerChannel } from "@/inngest/channels/google-sheets-trigger";

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
