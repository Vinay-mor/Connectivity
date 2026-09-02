import { InitialNode } from "@/components/initial-node";
import { AnthropicNode } from "@/features/executions/components/anthropic/node";
import { DiscordNode } from "@/features/executions/components/discord/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { OpenAiNode } from "@/features/executions/components/openai/node";
import { SlackNode } from "@/features/executions/components/slack/node";
import { IfElseNode } from "@/features/executions/components/if-else/node";
import { GoogleSheetsNode } from "@/features/executions/components/google-sheets/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger/node";
import { GoogleSheetsTriggerNode } from "@/features/triggers/components/google-sheets-trigger/node";
import { NodeType } from "@/lib/prisma-enums";
import { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]:HttpRequestNode,
    [NodeType.MANUAL_TRIGGER]:ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]:GoogleFormTrigger,
    [NodeType.STRIPE_TRIGGER]:StripeTriggerNode,
    [NodeType.GOOGLE_SHEETS_TRIGGER]:GoogleSheetsTriggerNode,
    [NodeType.GEMINI]:GeminiNode,
    [NodeType.OPENAI]:OpenAiNode,
    [NodeType.ANTHROPIC]:AnthropicNode,
    [NodeType.DISCORD]:DiscordNode,
    [NodeType.SLACK]:SlackNode,
    [NodeType.IF_ELSE]:IfElseNode,
    [NodeType.GOOGLE_SHEETS]:GoogleSheetsNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;