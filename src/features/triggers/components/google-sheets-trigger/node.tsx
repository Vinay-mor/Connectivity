import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleSheetsTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_SHEETS_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-sheets-trigger";
import { fetchGoogleSheetsTriggerRealtimeToken } from "./actions";

export const GoogleSheetsTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GOOGLE_SHEETS_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGoogleSheetsTriggerRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    return (
        <>
            <GoogleSheetsTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                icon="/logos/google-sheets.svg"
                name="Google Sheets Trigger"
                description="When a row is added/updated"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

GoogleSheetsTriggerNode.displayName = "GoogleSheetsTriggerNode";
