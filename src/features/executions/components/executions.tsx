"use client";

import { formatDistanceToNow } from "date-fns";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions";
import React from "react";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { ExecutionStatus } from "@/lib/prisma-enums";
import type { Execution } from "@/generated/prisma";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();
  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export const ExecutionsHeader = () => {
  return (
    <EntityHeader
      title="Executions"
      description="Track and inspect live and past workflow execution logs"
    />
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();
  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Fetching execution logs..." />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Failed to load execution logs." />;
};

export const ExecutionsEmpty = () => {
  return (
    <EmptyView message="No workflow executions recorded yet. Run a workflow to view live execution logs." />
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-4 text-emerald-500" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-4 text-rose-500" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-4 text-primary animate-spin" />;
    default:
      return <ClockIcon className="size-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 font-mono text-[11px]">
          Success
        </Badge>
      );
    case ExecutionStatus.FAILED:
      return (
        <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20 font-mono text-[11px]">
          Failed
        </Badge>
      );
    case ExecutionStatus.RUNNING:
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-mono text-[11px]">
          Running
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="font-mono text-[11px]">
          {status}
        </Badge>
      );
  }
};

export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000
      )
    : null;

  const subtitle = (
    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
      <span className="font-medium text-foreground">{data.workflow.name}</span>
      <span>&bull;</span>
      <span>{formatDistanceToNow(data.startedAt, { addSuffix: true })}</span>
      {duration !== null && (
        <>
          <span>&bull;</span>
          <span className="font-mono">{duration}s</span>
        </>
      )}
    </div>
  );

  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={data.workflow.name}
      subtitle={subtitle}
      image={getStatusIcon(data.status)}
      actions={getStatusBadge(data.status)}
    />
  );
};
