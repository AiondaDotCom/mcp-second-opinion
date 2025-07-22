import { AIProvider } from './base.js';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { AISecondOpinionConfig } from '../types/index.js';
import logger from '../utils/logger.js';

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
      logger.debug(`Executing Gemini CLI: gemini -m "${this.config.model}" -p`);
      
      return new Promise((resolve, reject) => {
        const child = spawn('gemini', ['-m', this.config.model, '-p'], {
          timeout: 60000
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        child.on('close', (code) => {
          if (stderr && !stderr.includes('warning') && !stderr.includes('Loaded cached credentials')) {
            logger.warn('Gemini CLI stderr:', stderr);
          }

          if (code !== 0) {
            reject(new Error(`Gemini CLI exited with code ${code}: ${stderr}`));
            return;
          }

          if (!stdout.trim()) {
            reject(new Error('Gemini CLI returned empty response'));
            return;
          }

          resolve(stdout.trim());
        });

        child.on('error', (error) => {
          if (error.message.includes('ENOENT')) {
            reject(new Error('Gemini CLI not found - please install it first'));
          } else {
            reject(new Error(`Gemini CLI error: ${error.message}`));
          }
        });

        // Send prompt via stdin
        child.stdin.write(prompt);
        child.stdin.end();
      });
    } catch (error) {
      logger.error('Gemini CLI error:', error);
      throw new Error(`Gemini CLI error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  validateConfig(config: any): boolean {
    return config.enabled === true;
  }
}