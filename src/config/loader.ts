import { AISecondOpinionConfigSchema } from './schema.js';
import { AISecondOpinionConfig } from '../types/index.js';
import * as fs from 'fs';
import * as path from 'path';

export function loadConfig(): AISecondOpinionConfig {
  const configPath = path.resolve(process.cwd(), 'config', 'default.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  // Override API keys from environment variables
  if (process.env.OPENAI_API_KEY) {
    config.providers.openai.apiKey = process.env.OPENAI_API_KEY;
  }
  
  // Gemini now uses CLI, no API key needed
  // if (process.env.GOOGLE_API_KEY) {
  //   config.providers.gemini.apiKey = process.env.GOOGLE_API_KEY;
  // }
  
  if (process.env.OLLAMA_BASE_URL) {
    config.providers.ollama.baseUrl = process.env.OLLAMA_BASE_URL;
  }
  
  return AISecondOpinionConfigSchema.parse(config);
}