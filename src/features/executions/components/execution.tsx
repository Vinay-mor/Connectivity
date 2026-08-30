"use client";

import { ExecutionStatus } from "@/lib/prisma-enums";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon, ArrowLeftIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSuspenseExecution } from "../hooks/use-executions";

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-emerald-500" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-rose-500" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-primary animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export const ExecutionView = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useSuspenseExecution(executionId);
  const [showStackTrace, setShowStackTrace] = useState(false);

  const duration = execution.completedAt
    ? Math.round(
        (new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime()) /
          1000
      )
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild className="rounded-xl h-9">
          <Link href="/executions">
            <ArrowLeftIcon className="size-4 mr-1" />
            Back to Executions
          </Link>
        </Button>
      </div>

      <Card className="glass-panel border-border/60 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-card border border-border/60 shadow-sm">
              {getStatusIcon(execution.status)}
            </div>
            <div>
              <CardTitle className="text-xl font-display font-bold">
                {formatStatus(execution.status)}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Execution log for workflow{" "}
                <Link
                  href={`/workflows/${execution.workflowId}`}
                  className="text-primary hover:underline font-medium"
                >
                  {execution.workflow.name}
                </Link>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-card/60 border border-border/40">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Workflow
              </p>
              <Link
                href={`/workflows/${execution.workflowId}`}
                prefetch
                className="text-sm font-semibold hover:underline text-primary"
              >
                {execution.workflow.name}
              </Link>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatStatus(execution.status)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Started
              </p>
              <p className="text-sm text-foreground">
                {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
              </p>
            </div>
            {duration !== null && (
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Duration
                </p>
                <p className="text-sm font-mono text-foreground">{duration}s</p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Event ID
            </p>
            <p className="text-xs font-mono bg-card px-3 py-2 rounded-xl border border-border/60 text-foreground overflow-auto">
              {execution.inngestEventId}
            </p>
          </div>

          {execution.error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-3">
              <div>
                <p className="text-xs font-semibold text-rose-500 mb-1">
                  Error Detail
                </p>
                <p className="text-xs text-rose-400 font-mono overflow-auto leading-relaxed">
                  {execution.error}
                </p>
              </div>

              {execution.errorStack && (
                <Collapsible
                  open={showStackTrace}
                  onOpenChange={setShowStackTrace}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-0 h-auto font-mono"
                    >
                      {showStackTrace ? "Hide stack trace" : "Show stack trace"}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="text-[11px] font-mono text-rose-400 overflow-auto mt-2 p-3 bg-card/80 border border-rose-500/20 rounded-xl max-h-60">
                      {execution.errorStack}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          )}

          {execution.output && (
            <div className="space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Output Payload
              </p>
              <pre className="text-xs font-mono p-4 bg-card/80 border border-border/60 rounded-xl overflow-auto max-h-96 text-foreground leading-relaxed">
                {JSON.stringify(execution.output, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
