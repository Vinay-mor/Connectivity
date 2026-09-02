"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { generateGoogleSheetsScript } from "./utils";

const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
        }),
    spreadsheetId: z
        .string()
        .min(1, "Spreadsheet ID or Webhook URL is required"),
    sheetName: z
        .string()
        .min(1, "Sheet name is required"),
    values: z
        .string()
        .min(1, "Row values or content is required"),
    apiKey: z
        .string()
        .optional(),
});

export type GoogleSheetsFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (value: GoogleSheetsFormValues) => void;
    defaultValues?: Partial<GoogleSheetsFormValues>;
}

export const GoogleSheetsDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<GoogleSheetsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            spreadsheetId: defaultValues.spreadsheetId || "",
            sheetName: defaultValues.sheetName || "Sheet1",
            values: defaultValues.values || "",
            apiKey: defaultValues.apiKey || "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                spreadsheetId: defaultValues.spreadsheetId || "",
                sheetName: defaultValues.sheetName || "Sheet1",
                values: defaultValues.values || "",
                apiKey: defaultValues.apiKey || "",
            });
        }
    }, [open, defaultValues, form]);

    const watchVariableName = form.watch("variableName") || "myGoogleSheet";

    const handleSubmit = (values: GoogleSheetsFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    const handleCopyScript = async () => {
        const script = generateGoogleSheetsScript();
        try {
            await navigator.clipboard.writeText(script);
            toast.success("Google Apps Script copied to clipboard!");
        } catch {
            toast.error("Failed to copy script to clipboard");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Google Sheets Configuration</DialogTitle>
                    <DialogDescription>
                        Append rows directly to your Google Sheet without complex API setup.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Setup Instructions Box */}
                    <div className="rounded-lg bg-muted p-3.5 space-y-2 border border-border/50 text-xs">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                                🚀 Easy Setup Guide (Google Apps Script Webhook):
                            </h4>
                        </div>
                        <ol className="text-muted-foreground space-y-1 list-decimal list-inside leading-relaxed">
                            <li>Open your Google Spreadsheet.</li>
                            <li>Click <b>Extensions ➔ Apps Script</b>.</li>
                            <li>Click the button below and paste the code into Apps Script.</li>
                            <li>Click <b>Deploy ➔ New deployment ➔ Web app</b> (Set Access: <b>Anyone</b>).</li>
                            <li>Copy the generated Web App URL into the field below.</li>
                        </ol>
                        <div className="pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full text-xs gap-2"
                                onClick={handleCopyScript}
                            >
                                <CopyIcon className="size-3.5" />
                                Copy Google Apps Script Code
                            </Button>
                        </div>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="variableName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variable Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="myGoogleSheet"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Reference result in downstream nodes: {`{{${watchVariableName}.status}}`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="spreadsheetId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Web App URL / Spreadsheet ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://script.google.com/macros/s/.../exec"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Paste your Apps Script Web App URL (or Google Sheets API ID).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sheetName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sheet / Tab Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Sheet1"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="values"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Row Values (JSON Array or Text)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='["{{myTrigger.name}}", "{{myTrigger.email}}", "{{myGemini.text}}"]'
                                                className="min-h-[70px] font-mono text-xs"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Comma-separated or JSON array. Use {"{{variables}}"} for dynamic node outputs.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="apiKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>API Key (Optional for Google Cloud API v4)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Google Cloud API Key (Leave blank if using Web App URL)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="pt-2">
                                <Button type="submit">Save Configuration</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
