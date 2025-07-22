import { AIProvider } from './base.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { AISecondOpinionConfig } from '../types/index.js';
import logger from '../utils/logger.js';

const execAsync = promisify(exec);

export class GeminiProvider extends AIProvider {
  name = 'gemini';
  private config: AISecondOpinionConfig['providers']['gemini'];

  constructor(config: AISecondOpinionConfig) {
    super();
    this.config = config.providers.gemini;
  }

  isConfigured(): boolean {
    return this.config.enabled;
  }

  async generateResponse(prompt: string, role?: string): Promise<string> {
    try {
      const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, '\\n');
      const command = `gemini -m "${this.config.model}" -p "${escapedPrompt}"`;
      
      logger.debug(`Executing Gemini CLI: gemini -m "${this.config.model}" -p "[prompt]"`);
      
      const { stdout, stderr } = await execAsync(command, {
        timeout: 60000,
        maxBuffer: 1024 * 1024
      });

      if (stderr && !stderr.includes('warning')) {
        logger.warn('Gemini CLI stderr:', stderr);
      }

      if (!stdout.trim()) {
        throw new Error('Gemini CLI returned empty response');
      }

      return stdout.trim();
    } catch (error) {
      logger.error('Gemini CLI error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          throw new Error('Gemini CLI timeout - request took too long');
        }
        if (error.message.includes('ENOENT') || error.message.includes('not found')) {
          throw new Error('Gemini CLI not found - please install it first');
        }
      }
      
      throw new Error(`Gemini CLI error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  validateConfig(config: any): boolean {
    return config.enabled === true;
  }
}