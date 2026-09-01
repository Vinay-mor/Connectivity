import { channel, topic } from "@inngest/realtime";

export const IF_ELSE_CHANNEL_NAME = "if-else-execution";

export const ifElseChannel = channel((workflowId: string) => `${IF_ELSE_CHANNEL_NAME}:${workflowId}`)
    .addTopic(
        topic("status").type<{
            nodeId: string;
            status: "loading" | "success" | "error";
        }>(),
    );
