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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message: "Variable name must start with a letter/underscore and contain only letters, numbers, and underscores",
        }),
    leftValue: z.string().min(1, { message: "Value/Expression to evaluate is required" }),
    operator: z.enum([
        "equals",
        "not_equals",
        "contains",
        "greater_than",
        "less_than",
        "is_empty",
        "is_not_empty",
    ]),
    rightValue: z.string().optional(),
});

export type IfElseFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: IfElseFormValues) => void;
    defaultValues?: Partial<IfElseFormValues>;
}

export const IfElseDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<IfElseFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "conditionResult",
            leftValue: defaultValues.leftValue || "",
            operator: defaultValues.operator || "equals",
            rightValue: defaultValues.rightValue || "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "conditionResult",
                leftValue: defaultValues.leftValue || "",
                operator: defaultValues.operator || "equals",
                rightValue: defaultValues.rightValue || "",
            });
        }
    }, [open, defaultValues, form]);

    const watchOperator = form.watch("operator");
    const watchVariableName = form.watch("variableName") || "conditionResult";
    const hideRightValue = watchOperator === "is_empty" || watchOperator === "is_not_empty";

    const handleSubmit = (values: IfElseFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>If / Else Condition</DialogTitle>
                    <DialogDescription>
                        Evaluate a condition on prior node data to branch your workflow into True or False paths.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-2">
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="conditionResult" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Stores execution output in context: {`{{${watchVariableName}.result}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="leftValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value / Expression (Left Side)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="{{httpResponse.status}} or {{openai.text}}"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Use Handlebars expression like {`{{httpResponse.data.status}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="operator"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comparison Operator</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select operator" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="equals">Equals (==)</SelectItem>
                                            <SelectItem value="not_equals">Does Not Equal (!=)</SelectItem>
                                            <SelectItem value="contains">Contains</SelectItem>
                                            <SelectItem value="greater_than">Greater Than (&gt;)</SelectItem>
                                            <SelectItem value="less_than">Less Than (&lt;)</SelectItem>
                                            <SelectItem value="is_empty">Is Empty / Null</SelectItem>
                                            <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {!hideRightValue && (
                            <FormField
                                control={form.control}
                                name="rightValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Compare Value (Right Side)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="200, SUCCESS, or true" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            The target value or variable to evaluate against.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter className="pt-2">
                            <Button type="submit">Save Configuration</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
