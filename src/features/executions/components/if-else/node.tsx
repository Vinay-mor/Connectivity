"use client";

import { useReactFlow, Position, type Node, type NodeProps } from "@xyflow/react";
import { GitForkIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";
import { NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";
import { IfElseDialog, type IfElseFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { IF_ELSE_CHANNEL_NAME } from "@/inngest/channels/if-else";
import { useParams } from "next/navigation";
import { fetchIfElseRealtimeToken } from "./actions";

type IfElseNodeData = {
    variableName?: string;
    leftValue?: string;
    operator?: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_empty" | "is_not_empty";
    rightValue?: string;
};

type IfElseNodeType = Node<IfElseNodeData>;

export const IfElseNode = memo((props: NodeProps<IfElseNodeType>) => {
    const params = useParams();
    const workflowId = params.workflowId as string;
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes, setEdges } = useReactFlow();
    const nodeData = props.data;

    const description = nodeData?.leftValue
        ? `${nodeData.leftValue} ${nodeData.operator || "equals"} ${nodeData.rightValue || ""}`
        : "Not Configured";

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: `${IF_ELSE_CHANNEL_NAME}:${workflowId}`,
        topic: "status",
        refreshToken: () => fetchIfElseRealtimeToken(workflowId),
    });

    const handleOpenSettings = () => setDialogOpen(true);

    const handleDelete = () => {
        setNodes((currentNodes) => currentNodes.filter((node) => node.id !== props.id));
        setEdges((currentEdges) =>
            currentEdges.filter(
                (edge) => edge.source !== props.id && edge.target !== props.id
            )
        );
    };

    const handleSubmit = (values: IfElseFormValues) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            variableName: values.variableName,
                            leftValue: values.leftValue,
                            operator: values.operator,
                            rightValue: values.rightValue,
                        },
                    };
                }
                return node;
            })
        );
    };

    return (
        <>
            <IfElseDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <WorkflowNode
                name="If / Else Condition"
                description={description}
                onDelete={handleDelete}
                onSettings={handleOpenSettings}
            >
                <NodeStatusIndicator status={nodeStatus} variant="border">
                    <BaseNode status={nodeStatus} onDoubleClick={handleOpenSettings} className="relative">
                        <BaseNodeContent>
                            <GitForkIcon className="size-4 text-amber-500 shrink-0" />

                            {/* Input Handle (Left) */}
                            <BaseHandle
                                id="target-1"
                                type="target"
                                position={Position.Left}
                            />

                            {/* True Output Handle (Top Right) */}
                            <BaseHandle
                                id="true"
                                type="source"
                                position={Position.Right}
                                style={{ top: "30%" }}
                                className="!bg-emerald-500 !border-emerald-600"
                                title="True Output"
                            />

                            {/* False Output Handle (Bottom Right) */}
                            <BaseHandle
                                id="false"
                                type="source"
                                position={Position.Right}
                                style={{ top: "70%" }}
                                className="!bg-rose-500 !border-rose-600"
                                title="False Output"
                            />
                        </BaseNodeContent>
                    </BaseNode>
                </NodeStatusIndicator>
            </WorkflowNode>
        </>
    );
});

IfElseNode.displayName = "IfElseNode";
