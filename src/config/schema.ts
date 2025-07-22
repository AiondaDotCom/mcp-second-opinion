import { z } from 'zod';

export const AISecondOpinionConfigSchema = z.object({
  providers: z.object({
    openai: z.object({
      enabled: z.boolean(),
      apiKey: z.string(),
      model: z.string(),
      defaultRole: z.string(),
      customPrompt: z.string().optional(),
    }),
    gemini: z.object({
      enabled: z.boolean(),
      model: z.string(),
      defaultRole: z.string(),
      customPrompt: z.string().optional(),
    }),
    ollama: z.object({
      enabled: z.boolean(),
      baseUrl: z.string(),
      model: z.string(),
      defaultRole: z.string(),
      customPrompt: z.string().optional(),
      timeout: z.number().optional(),
    }),
    claude: z.object({
      enabled: z.boolean(),
      model: z.string().optional(),
      defaultRole: z.string(),
      customPrompt: z.string().optional(),
      timeout: z.number().optional(),
    }),
  }),
  tools: z.object({
    askChatGPT: z.object({
      name: z.string(),
      description: z.string(),
      enabled: z.boolean(),
    }),
    askGemini: z.object({
      name: z.string(),
      description: z.string(),
      enabled: z.boolean(),
    }),
    askOllama: z.object({
      name: z.string(),
      description: z.string(),
      enabled: z.boolean(),
    }),
    askClaude: z.object({
      name: z.string(),
      description: z.string(),
      enabled: z.boolean(),
    }),
    compareAIOpinions: z.object({
      name: z.string(),
      description: z.string(),
      enabled: z.boolean(),
    }),
  }),
  logging: z.object({
    level: z.enum(["debug", "info", "warn", "error"]),
    enabled: z.boolean(),
  }),
});