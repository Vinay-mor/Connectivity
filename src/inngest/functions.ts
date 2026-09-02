import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/lib/prisma-enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { openAiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";
import { ifElseChannel } from "./channels/if-else";
import { googleSheetsChannel } from "./channels/google-sheets";
import { googleSheetsTriggerChannel } from "./channels/google-sheets-trigger";

export const executeWorkflow = inngest.createFunction(
    {
        id: "execute-workflow",
        retries: process.env.NODE_ENV === "production" ? 3 : 0,
        onFailure: async ({ event, step }) => {
            return prisma.execution.update({
                where: { inngestEventId: event.data.event.id },
                data: {
                    status: ExecutionStatus.FAILED,
                    error: event.data.error.message,
                    errorStack: event.data.error.stack,
                },
            });
        },
    },
    {
        event: "workflows/execute.workflow",
        channels: [
            httpRequestChannel(),
            manualTriggerChannel(),
            googleFormTriggerChannel(),
            stripeTriggerChannel(),
            geminiChannel(),
            openAiChannel(),
            anthropicChannel(),
            discordChannel(),
            slackChannel(),
            ifElseChannel,
            googleSheetsChannel(),
            googleSheetsTriggerChannel(),
        ],
    },
    async ({ event, step, publish }) => {
        const inngestEventId = event.id;
        const workflowId = event.data.workflowId;

        if (!inngestEventId || !workflowId) {
            throw new NonRetriableError("Event ID or workflow ID is missing");
        }

        await step.run("create-execution", async () => {
            return prisma.execution.create({
                data: {
                    workflowId,
                    inngestEventId,
                },
            });
        });

        const { sortedNodes, connections } = await step.run("prepare-workflow", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: { id: workflowId },
                include: {
                    nodes: true,
                    connection: true,
                },
            });

            return {
                sortedNodes: topologicalSort(workflow.nodes, workflow.connection),
                connections: workflow.connection,
            };
        });

        const userId = await step.run("find-user-id", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: { id: workflowId },
                select: {
                    userId: true,
                },
            });
            return workflow.userId;
        });

        // Initialize context with any initial data from the trigger
        let context = event.data.initialData || {};

        // Active node reachability set to support conditional branching (If/Else)
        // Seed activeNodeIds with all root nodes (nodes with no incoming connections)
        const incomingNodeIds = new Set(connections.map((conn) => conn.toNodeId));
        const activeNodeIds = new Set<string>();
        for (const node of sortedNodes) {
            if (!incomingNodeIds.has(node.id)) {
                activeNodeIds.add(node.id);
            }
        }

        for (const node of sortedNodes) {
            // If there are connections in workflow but node is not active/reachable, skip execution
            if (connections.length > 0 && !activeNodeIds.has(node.id)) {
                continue;
            }

            const executor = getExecutor(node.type as NodeType);
            context = await executor({
                data: node.data as Record<string, unknown>,
                nodeId: node.id,
                userId,
                workflowId,
                context,
                step,
                publish,
            });

            // Propagate active status to downstream target nodes based on output handles
            const outgoingConnections = connections.filter((conn) => conn.fromNodeId === node.id);

            if (node.type === NodeType.IF_ELSE) {
                // If/Else node stores branch decision in context under `__node_${node.id}`
                const nodeOutput = context[`__node_${node.id}`] as { selectedBranch?: string } | undefined;
                const selectedBranch = nodeOutput?.selectedBranch || "true";

                for (const conn of outgoingConnections) {
                    // Only activate downstream target nodes connected to the selected branch handle
                    if (conn.fromOutput === selectedBranch) {
                        activeNodeIds.add(conn.toNodeId);
                    }
                }
            } else {
                // Standard node activates all downstream target nodes
                for (const conn of outgoingConnections) {
                    activeNodeIds.add(conn.toNodeId);
                }
            }
        }

        await step.run("update-execution", async () => {
            return prisma.execution.update({
                where: { inngestEventId, workflowId },
                data: {
                    status: ExecutionStatus.SUCCESS,
                    completedAt: new Date(),
                    output: context,
                },
            });
        });

        return {
            workflowId,
            result: context,
        };
    },
);