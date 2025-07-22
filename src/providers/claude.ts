import { AIProvider } from './base.js';
import { spawn } from 'child_process';
import { AISecondOpinionConfig } from '../types/index.js';
import logger from '../utils/logger.js';

export class ClaudeProvider extends AIProvider {
  name = 'claude';
  private config: AISecondOpinionConfig['providers']['claude'];

  constructor(config: AISecondOpinionConfig) {
    super();
    this.config = config.providers.claude;
  }

  isConfigured(): boolean {
    return this.config.enabled;
  }

  async generateResponse(prompt: string, role?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        logger.debug(`Executing Claude CLI with stdin input`);
        
        const claude = spawn('claude');
        let stdout = '';
        let stderr = '';

        claude.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        claude.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        claude.on('close', (code) => {
          if (code !== 0) {
            logger.error('Claude CLI error:', { code, stderr });
            reject(new Error(`Claude CLI exited with code ${code}: ${stderr}`));
            return;
          }

          if (stderr && !stderr.includes('warning')) {
            logger.warn('Claude CLI stderr:', stderr);
          }

          if (!stdout.trim()) {
            reject(new Error('Claude CLI returned empty response'));
            return;
          }

          resolve(stdout.trim());
        });

        claude.on('error', (error) => {
          logger.error('Claude CLI spawn error:', error);
          reject(new Error(`Claude CLI spawn error: ${error.message}`));
        });

        // Set timeout
        const timeout = setTimeout(() => {
          claude.kill();
          reject(new Error('Claude CLI timeout - request took too long'));
        }, 30000);

        claude.on('close', () => {
          clearTimeout(timeout);
        });

        // Send prompt via stdin
        claude.stdin.write(prompt + '\n');
        claude.stdin.end();

      } catch (error) {
        reject(error);
      }
    });
  }

  validateConfig(config: any): boolean {
    return config.enabled === true;
  }
}