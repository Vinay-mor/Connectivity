"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { generateGoogleSheetsTriggerScript } from "./utils";
import { getGoogleSheetsWebhookSecret } from "./actions";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GoogleSheetsTriggerDialog = ({
    open,
    onOpenChange,
}: Props) => {
    const params = useParams();
    const workflowId = params.workflowId as string;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const [secret, setSecret] = useState<string>("");

    useEffect(() => {
        if (workflowId) {
            getGoogleSheetsWebhookSecret(workflowId).then(setSecret).catch(console.error);
        }
    }, [workflowId]);

    const secretParam = secret ? `&secret=${secret}` : "";
    const webhookUrl = `${baseUrl}/api/webhooks/google-sheets?workflowId=${workflowId}${secretParam}`;


    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard");
        } catch {
            toast.error("Failed to copy URL");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Google Sheets Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in Google Sheets Apps Script to trigger this workflow whenever a row is created or modified.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">Generated Webhook URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="webhook-url"
                                value={webhookUrl}
                                readOnly
                                className="font-mono text-xs"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={copyToClipboard}
                            >
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2 text-xs">
                        <h4 className="font-medium text-sm text-foreground">Setup instructions:</h4>
                        <ol className="text-muted-foreground space-y-1 list-decimal list-inside leading-relaxed">
                            <li>Open your Google Sheet.</li>
                            <li>Click <b>Extensions ➔ Apps Script</b>.</li>
                            <li>Paste the copied script below.</li>
                            <li>Click <b>Triggers (alarm icon) ➔ Add Trigger</b>.</li>
                            <li>Choose event type: <b>On edit</b> or <b>On change</b> ➔ Save.</li>
                        </ol>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-3 text-xs">
                        <h4 className="font-medium text-sm text-foreground">Google Apps Script:</h4>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full text-xs"
                            onClick={async () => {
                                const script = generateGoogleSheetsTriggerScript(webhookUrl);
                                try {
                                    await navigator.clipboard.writeText(script);
                                    toast.success("Trigger script copied to clipboard");
                                } catch {
                                    toast.error("Failed to copy script");
                                }
                            }}
                        >
                            <CopyIcon className="size-4 mr-2" />
                            Copy Google Apps Script Code
                        </Button>
                        <p className="text-muted-foreground">
                            Includes your unique Webhook URL and automatically sends updated row data to this workflow.
                        </p>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2 text-xs">
                        <h4 className="font-medium text-sm text-foreground">Available Variables in Downstream Nodes</h4>
                        <ul className="text-muted-foreground space-y-1.5 font-mono">
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded text-foreground">
                                    {"{{googleSheet.sheetName}}"}
                                </code>{" "}
                                - Sheet / Tab name
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded text-foreground">
                                    {"{{googleSheet.rowValues['Column Name']}}"}
                                </code>{" "}
                                - Value of specific column
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded text-foreground">
                                    {"{{json googleSheet.rowValues}}"}
                                </code>{" "}
                                - All row values as JSON
                            </li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
