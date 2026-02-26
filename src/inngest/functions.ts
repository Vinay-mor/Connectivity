import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {generateText} from "ai";
import {createOpenAI} from "@ai-sdk/openai";
import {createAnthropic} from "@ai-sdk/anthropic"

const google=createGoogleGenerativeAI();
const openai=createOpenAI();
const anthropic=createAnthropic();
export const execute = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ event, step }) => {
        await step.sleep("pretend",10000)
        const {steps:geminiSteps}=await step.ai.wrap("gemini-generate-text",generateText,{
            model:google("gemini-3-flash-preview"),
            system:"You are a helpful assistant.",
            prompt:"What is 4+4?"
        });
        const {steps:openaiSteps}=await step.ai.wrap("openai-generate-text",generateText,{
            model:openai("gpt-4"),
            system:"You are a helpful assistant.",
            prompt:"What is 4+4?"
        });
        const {steps:anthropicSteps}=await step.ai.wrap("anthropic-generate-text",generateText,{
            model:anthropic("claude-opus-4-6"),
            system:"You are a helpful assistant.",
            prompt:"What is 4+4?"
        });
        return {
            geminiSteps,openaiSteps,anthropicSteps,
        }
    },
);