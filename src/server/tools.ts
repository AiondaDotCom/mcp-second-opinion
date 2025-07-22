import { loadConfig } from '../config/loader.js';

const config = loadConfig();

export const tools = {
  ask_chatgpt_second_opinion: {
    name: 'ask_chatgpt_second_opinion',
    description: config.tools.askChatGPT.description,
    inputSchema: {
      type: 'object' as const,
      properties: {
        question: { type: 'string' },
        context: { type: 'string' },
        role: { type: 'string' },
      },
      required: ['question'],
    },
  },
  ask_gemini_third_opinion: {
    name: 'ask_gemini_third_opinion',
    description: config.tools.askGemini.description,
    inputSchema: {
      type: 'object' as const,
      properties: {
        question: { type: 'string' },
        context: { type: 'string' },
        role: { type: 'string' },
      },
      required: ['question'],
    },
  },
  ask_ollama_local_opinion: {
    name: 'ask_ollama_local_opinion',
    description: config.tools.askOllama.description,
    inputSchema: {
      type: 'object' as const,
      properties: {
        question: { type: 'string' },
        context: { type: 'string' },
        role: { type: 'string' },
        model: { type: 'string' },
      },
      required: ['question'],
    },
  },
  compare_ai_opinions: {
    name: 'compare_ai_opinions',
    description: 'Get opinions from all enabled AIs and compare them',
    inputSchema: {
      type: 'object' as const,
      properties: {
        question: { type: 'string' },
        context: { type: 'string' },
      },
      required: ['question'],
    },
  },
};