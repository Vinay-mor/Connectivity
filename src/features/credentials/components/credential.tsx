"use client";

import { CredentialType } from "@/lib/prisma-enums";
import {
  useCreateCredentials,
  useUpdateCredential,
  useSuspenseCredential,
} from "../hooks/use-credentials";
import { useUpgradeModel } from "@/hooks/use-upgrade-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, KeyIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
  {
    value: CredentialType.OPENAI,
    label: "OpenAI",
    logo: "/logos/openai.svg",
  },
  {
    value: CredentialType.ANTHROPIC,
    label: "Anthropic",
    logo: "/logos/anthropic.svg",
  },
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    logo: "/logos/gemini.svg",
  },
];

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter();
  const createCredential = useCreateCredentials();
  const updateCredential = useUpdateCredential();
  const { handleError, modal } = useUpgradeModel();

  const isEdit = !!initialData?.id;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.OPENAI,
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateCredential.mutateAsync({
        id: initialData.id,
        ...values,
      });
    } else {
      await createCredential.mutateAsync(values, {
        onSuccess: (data) => {
          router.push(`/credentials/${data.id}`);
        },
        onError: (error) => {
          handleError(error);
        },
      });
    }
  };

  return (
    <>
      {modal}
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="rounded-xl h-9">
            <Link href="/credentials">
              <ArrowLeftIcon className="size-4 mr-1" />
              Back to Credentials
            </Link>
          </Button>
        </div>

        <Card className="glass-panel border-border/60 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/40 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <KeyIcon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-display font-bold">
                  {isEdit ? "Edit Credential" : "Create Credential"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {isEdit
                    ? "Update your secret API key or provider configuration"
                    : "Add a secure API key to enable AI and external model nodes"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-foreground">
                        Credential Identifier
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Production OpenAI Key"
                          className="h-11 rounded-xl border-border/80 focus:border-primary focus:ring-primary/20 bg-background/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-foreground">
                        Provider Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-border/80 focus:border-primary focus:ring-primary/20 bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border border-border/80 bg-popover/90 backdrop-blur-md">
                          {credentialTypeOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="rounded-lg text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={option.logo}
                                  alt={option.label}
                                  width={16}
                                  height={16}
                                />
                                <span className="font-medium">{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-foreground">
                        API Secret Key
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="sk-..."
                          className="h-11 rounded-xl border-border/80 focus:border-primary focus:ring-primary/20 bg-background/50 font-mono text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-3 border-t border-border/40">
                  <Button
                    type="submit"
                    className="h-10 rounded-xl px-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold shadow-md shadow-cyan-500/20 transition-all"
                    disabled={
                      createCredential.isPending || updateCredential.isPending
                    }
                  >
                    {isEdit ? "Update Credential" : "Save Credential"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-xl px-5"
                    onClick={() => router.push("/credentials")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSuspenseCredential(credentialId);
  return <CredentialForm initialData={credential} />;
};