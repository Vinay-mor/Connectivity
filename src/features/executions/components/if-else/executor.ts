import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { ifElseChannel } from "@/inngest/channels/if-else";

export type IfElseData = {
    variableName?: string;
    leftValue?: string;
    operator?: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_empty" | "is_not_empty";
    rightValue?: string;
};

export const ifElseExecutor: NodeExecutor<IfElseData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await publish(
        ifElseChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    try {
        const result = await step.run(`if-else-${nodeId}`, async () => {
            if (!data.variableName) {
                await publish(
                    ifElseChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );
                throw new NonRetriableError("If/Else node: Variable name not configured");
            }

            if (!data.leftValue) {
                await publish(
                    ifElseChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );
                throw new NonRetriableError("If/Else node: Left value expression not configured");
            }

            if (!data.operator) {
                await publish(
                    ifElseChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );
                throw new NonRetriableError("If/Else node: Comparison operator not configured");
            }

            const evaluatedLeft = Handlebars.compile(data.leftValue)(context);
            const evaluatedRight = data.rightValue ? Handlebars.compile(data.rightValue)(context) : "";

            let conditionMet = false;

            switch (data.operator) {
                case "equals":
                    conditionMet = evaluatedLeft.trim() === evaluatedRight.trim();
                    break;
                case "not_equals":
                    conditionMet = evaluatedLeft.trim() !== evaluatedRight.trim();
                    break;
                case "contains":
                    conditionMet = evaluatedLeft.toLowerCase().includes(evaluatedRight.toLowerCase());
                    break;
                case "greater_than":
                    conditionMet = Number(evaluatedLeft) > Number(evaluatedRight);
                    break;
                case "less_than":
                    conditionMet = Number(evaluatedLeft) < Number(evaluatedRight);
                    break;
                case "is_empty":
                    conditionMet = !evaluatedLeft || evaluatedLeft.trim() === "";
                    break;
                case "is_not_empty":
                    conditionMet = Boolean(evaluatedLeft && evaluatedLeft.trim() !== "");
                    break;
                default:
                    conditionMet = false;
            }

            const branchResult = {
                result: conditionMet,
                selectedBranch: conditionMet ? "true" : "false",
                evaluatedLeft,
                evaluatedRight,
                operator: data.operator,
            };

            return {
                ...context,
                [data.variableName]: branchResult,
                // Store node execution output keyed by nodeId for engine branch routing
                [`__node_${nodeId}`]: branchResult,
            };
        });

        await publish(
            ifElseChannel().status({
                nodeId,
                status: "success",
            }),
        );
        return result;
    } catch (error) {
        await publish(
            ifElseChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }
};
