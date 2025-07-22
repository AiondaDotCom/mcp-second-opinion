import { AIProvider } from './base.js';
import { OpenAI } from 'openai';
import { AISecondOpinionConfig } from '../types/index.js';

export class OpenAIProvider extends AIProvider {
  name = 'openai';
  private openai: OpenAI;
  private config: AISecondOpinionConfig['providers']['openai'];

  constructor(config: AISecondOpinionConfig) {
    super();
    this.config = config.providers.openai;
    this.openai = new OpenAI({ apiKey: this.config.apiKey });
  }

  isConfigured(): boolean {
    return this.config.enabled && !!this.config.apiKey;
  }

  async generateResponse(prompt: string, role?: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages: [
        { role: 'system', content: role || this.config.defaultRole },
        { role: 'user', content: prompt },
      ],
      model: this.config.model,
    });
    return completion.choices[0].message.content || '';
  }

  validateConfig(config: any): boolean {
    // Basic validation, more with Zod in config loader
    return typeof config.apiKey === 'string' && config.apiKey.length > 0;
  }
}