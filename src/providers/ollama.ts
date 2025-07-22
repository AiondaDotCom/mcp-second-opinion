import { AIProvider } from './base.js';
import { Ollama } from 'ollama';
import { AISecondOpinionConfig } from '../types/index.js';

export class OllamaProvider extends AIProvider {
  name = 'ollama';
  private ollama: Ollama;
  private config: AISecondOpinionConfig['providers']['ollama'];

  constructor(config: AISecondOpinionConfig) {
    super();
    this.config = config.providers.ollama;
    this.ollama = new Ollama({ host: this.config.baseUrl });
  }

  isConfigured(): boolean {
    return this.config.enabled;
  }

  async generateResponse(prompt: string, role?: string): Promise<string> {
    const response = await this.ollama.generate({
      model: this.config.model,
      prompt: `${role || this.config.defaultRole}: ${prompt}`,
    });
    return response.response;
  }

  validateConfig(config: any): boolean {
    return typeof config.baseUrl === 'string' && config.baseUrl.length > 0;
  }
}