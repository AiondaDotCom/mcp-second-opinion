import { OpenAIProvider } from '../providers/openai.js';
import { GeminiProvider } from '../providers/gemini.js';
import { OllamaProvider } from '../providers/ollama.js';
import { loadConfig } from '../config/loader.js';
import { askQuestionSchema, compareOpinionsSchema } from '../utils/validation.js';

const config = loadConfig();
const openaiProvider = new OpenAIProvider(config);
const geminiProvider = new GeminiProvider(config);
const ollamaProvider = new OllamaProvider(config);

export async function askChatGPT(input: any) {
  const { question, context, role } = askQuestionSchema.parse(input);
  if (!openaiProvider.isConfigured()) {
    return { error: 'OpenAI provider not configured' };
  }
  const prompt = context ? `${context}\n\n${question}` : question;
  const response = await openaiProvider.generateResponse(prompt, role);
  return { response };
}

export async function askGemini(input: any) {
  const { question, context, role } = askQuestionSchema.parse(input);
  if (!geminiProvider.isConfigured()) {
    return { error: 'Gemini provider not configured' };
  }
  const prompt = context ? `${context}\n\n${question}` : question;
  const response = await geminiProvider.generateResponse(prompt, role);
  return { response };
}

export async function askOllama(input: any) {
  const { question, context, role } = askQuestionSchema.parse(input);
  if (!ollamaProvider.isConfigured()) {
    return { error: 'Ollama provider not configured' };
  }
  const prompt = context ? `${context}\n\n${question}` : question;
  const response = await ollamaProvider.generateResponse(prompt, role);
  return { response };
}

export async function compareAIOpinions(input: any) {
  const { question, context } = compareOpinionsSchema.parse(input);
  const opinions: any = {};
  const prompt = context ? `${context}\n\n${question}` : question;

  if (openaiProvider.isConfigured()) {
    opinions.openai = await openaiProvider.generateResponse(prompt);
  }
  if (geminiProvider.isConfigured()) {
    opinions.gemini = await geminiProvider.generateResponse(prompt);
  }
  if (ollamaProvider.isConfigured()) {
    opinions.ollama = await ollamaProvider.generateResponse(prompt);
  }

  return opinions;
}