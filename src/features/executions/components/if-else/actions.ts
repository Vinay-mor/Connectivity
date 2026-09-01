"use server";

import { headers } from "next/headers";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { ifElseChannel } from "@/inngest/channels/if-else";
import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export type IfElseToken = Realtime.Token<
    typeof ifElseChannel,
    ["status"]
>;

export async function fetchIfElseRealtimeToken(workflowId: string): Promise<IfElseToken> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const workflow = await prisma.workflow.findFirst({
        where: {
            id: workflowId,
            userId: session.user.id,
        },
    });

    if (!workflow) {
        throw new Error("Unauthorized");
    }

    const token = await getSubscriptionToken(inngest, {
        channel: ifElseChannel(workflowId),
        topics: ["status"],
    });
    return token;
}
