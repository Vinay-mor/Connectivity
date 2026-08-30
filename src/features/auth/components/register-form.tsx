"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const registerSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signInGithub = async () => {
    await authClient.signIn.social(
      { provider: "github" },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const signInGoogle = async () => {
    await authClient.signIn.social(
      { provider: "google" },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const onSubmit = async (values: RegisterFormValues) => {
    await authClient.signUp.email(
      {
        name: values.email,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-6 w-full">
      <Card className="glass-panel border-border/60 shadow-xl rounded-2xl overflow-hidden backdrop-blur-xl bg-card/80">
        <CardHeader className="flex flex-col items-center justify-center text-center pb-2 pt-6">
          <CardTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
            Create an Account
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Get started building powerful automated workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-3">
                <Button
                  onClick={signInGithub}
                  variant="outline"
                  className="w-full h-11 rounded-xl gap-3 border-border/80 hover:bg-accent/60 transition-all font-medium"
                  type="button"
                  disabled={isPending}
                >
                  <Image alt="Github" src="/logos/github.svg" width={18} height={18} />
                  Continue with GitHub
                </Button>
                <Button
                  onClick={signInGoogle}
                  variant="outline"
                  className="w-full h-11 rounded-xl gap-3 border-border/80 hover:bg-accent/60 transition-all font-medium"
                  type="button"
                  disabled={isPending}
                >
                  <Image alt="Google" src="/logos/google.svg" width={18} height={18} />
                  Continue with Google
                </Button>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/60" />
                </div>
                <span className="relative bg-card px-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Or register with email
                </span>
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-foreground">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-foreground">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-foreground">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="h-11 rounded-xl border-border/80 focus:border-primary focus:ring-primary/20 bg-background/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold shadow-md shadow-cyan-500/25 transition-all mt-2"
                  disabled={isPending}
                >
                  {isPending ? "Creating account..." : "Create Account"}
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground pt-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}