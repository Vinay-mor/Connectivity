"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GitForkIcon, GlobeIcon, MousePointerIcon, ZapIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { NodeType } from "@/lib/prisma-enums";
import { Separator } from "./ui/separator";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
  iconClassName?: string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description: "Runs the flow on clicking a button. Good for testing.",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs the flow when a Google Form response is submitted",
    icon: "/logos/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe Event",
    description: "Runs the flow when a Stripe Event is captured",
    icon: "/logos/stripe.svg",
  },
  {
    type: NodeType.GOOGLE_SHEETS_TRIGGER,
    label: "Google Sheets Trigger",
    description: "Runs the flow when a new row is added or updated in a Google Sheet",
    icon: "/logos/google-sheets.svg",
    iconClassName: "size-5 object-contain",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an API HTTP request to any webhook or service",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Uses Google Gemini to generate text or structure data",
    icon: "/logos/gemini.svg",
    iconClassName: "size-5 object-contain",
  },
  {
    type: NodeType.OPENAI,
    label: "OpenAI",
    description: "Uses OpenAI GPT models to generate completion text",
    icon: "/logos/openai.svg",
    iconClassName: "size-5 object-contain",
  },
  {
    type: NodeType.ANTHROPIC,
    label: "Anthropic",
    description: "Uses Anthropic Claude models for reasoning tasks",
    icon: "/logos/anthropic.svg",
    iconClassName: "size-5 object-contain",
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Send automated messages to a Discord channel",
    icon: "/logos/discord.svg",
    iconClassName: "size-5 object-contain",
  },
  {
    type: NodeType.SLACK,
    label: "Slack",
    description: "Send automated messages to a Slack channel",
    icon: "/logos/slack.svg",
    iconClassName: "size-5 object-contain",
  },
  {
    type: NodeType.IF_ELSE,
    label: "If / Else Condition",
    description: "Branch workflow execution paths based on evaluated node conditions",
    icon: GitForkIcon,
  },
  {
    type: NodeType.GOOGLE_SHEETS,
    label: "Google Sheets",
    description: "Append rows or interact with Google Sheets spreadsheets",
    icon: "/logos/google-sheets.svg",
    iconClassName: "size-5 object-contain",
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({ open, onOpenChange, children }: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER
        );

        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed per workflow");
          return;
        }
      }
      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL
        );
        const centerY = window.innerHeight / 2;
        const centerX = window.innerWidth / 2;

        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });
        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selection.type,
        };
        if (hasInitialTrigger) {
          return [newNode];
        }

        return [...nodes, newNode];
      });

      onOpenChange(false);
    },
    [setNodes, getNodes, onOpenChange, screenToFlowPosition]
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto bg-card/90 backdrop-blur-xl border-l border-border/60 p-6"
      >
        <SheetHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
            <ZapIcon className="size-4" />
            <span>Workflow Building Block</span>
          </div>
          <SheetTitle className="font-display font-bold text-xl text-foreground">
            Select a Node Component
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Choose a trigger to start your workflow, or an action node to process data.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pt-6">
          <div>
            <h3 className="font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Trigger Nodes
            </h3>
            <div className="space-y-2">
              {triggerNodes.map((nodeType) => {
                const Icon = nodeType.icon;
                return (
                  <div
                    key={nodeType.type}
                    className="w-full p-3.5 rounded-xl cursor-pointer border border-border/50 bg-background/50 hover:border-primary/40 hover:bg-accent/60 transition-all duration-200"
                    onClick={() => handleNodeSelect(nodeType)}
                  >
                    <div className="flex items-center gap-3.5 w-full">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                        {typeof Icon === "string" ? (
                          <img
                            src={Icon}
                            alt={nodeType.label}
                            className={nodeType.iconClassName ?? "size-5"}
                          />
                        ) : (
                          <Icon className="size-4" />
                        )}
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold text-sm text-foreground">
                          {nodeType.label}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {nodeType.description}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-border/40" />

          <div>
            <h3 className="font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Action & Processing Nodes
            </h3>
            <div className="space-y-2">
              {executionNodes.map((nodeType) => {
                const Icon = nodeType.icon;
                return (
                  <div
                    key={nodeType.type}
                    className="w-full p-3.5 rounded-xl cursor-pointer border border-border/50 bg-background/50 hover:border-primary/40 hover:bg-accent/60 transition-all duration-200"
                    onClick={() => handleNodeSelect(nodeType)}
                  >
                    <div className="flex items-center gap-3.5 w-full">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary border border-secondary/20 shrink-0">
                        {typeof Icon === "string" ? (
                          <img
                            src={Icon}
                            alt={nodeType.label}
                            className={nodeType.iconClassName ?? "size-5"}
                          />
                        ) : (
                          <Icon className="size-4" />
                        )}
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold text-sm text-foreground">
                          {nodeType.label}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {nodeType.description}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}