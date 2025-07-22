export abstract class AIProvider {
  abstract name: string;
  abstract isConfigured(): boolean;
  abstract generateResponse(prompt: string, role?: string): Promise<string>;
  abstract validateConfig(config: any): boolean;
}