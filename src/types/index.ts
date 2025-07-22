export interface AISecondOpinionConfig {
  providers: {
    openai: {
      enabled: boolean;
      apiKey: string;
      model: string;
      defaultRole: string;
      customPrompt?: string;
    };
    gemini: {
      enabled: boolean;
      model: string;
      defaultRole: string;
      customPrompt?: string;
    };
    ollama: {
      enabled: boolean;
      baseUrl: string;
      model: string;
      defaultRole: string;
      customPrompt?: string;
      timeout?: number;
    };
  };
  tools: {
    askChatGPT: {
      name: string;
      description: string;
      enabled: boolean;
    };
    askGemini: {
      name: string;
      description: string;
      enabled: boolean;
    };
    askOllama: {
      name: string;
      description: string;
      enabled: boolean;
    };
  };
  logging: {
    level: "debug" | "info" | "warn" | "error";
    enabled: boolean;
  };
}