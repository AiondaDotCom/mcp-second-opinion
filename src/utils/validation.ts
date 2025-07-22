import { z } from 'zod';

export const askQuestionSchema = z.object({
  question: z.string(),
  context: z.string().optional(),
  role: z.string().optional(),
});

export const compareOpinionsSchema = z.object({
  question: z.string(),
  context: z.string().optional(),
});