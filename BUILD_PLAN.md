# MCP AI Second Opinion Server - Build Plan

## Project Overview

This MCP (Model Context Protocol) server enables Claude Code to get second opinions from other AI models (ChatGPT, Gemini) when it encounters difficult problems. The server provides configurable AI roles and customizable prompts for different use cases.

## Project Architecture

```
mcp-ai-second-opinion/
├── src/
│   ├── config/
│   │   ├── schema.ts           # Configuration validation
│   │   └── loader.ts           # Config loading logic
│   ├── providers/
│   │   ├── base.ts             # Abstract AI provider
│   │   ├── openai.ts           # OpenAI/ChatGPT integration
│   │   ├── gemini.ts           # Google Gemini integration
│   │   └── ollama.ts           # Ollama local model integration
│   ├── server/
│   │   ├── index.ts            # MCP server setup
│   │   ├── tools.ts            # Tool definitions
│   │   └── handlers.ts         # Request handlers
│   ├── utils/
│   │   ├── logger.ts           # Logging utility
│   │   └── validation.ts       # Input validation
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── tests/
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── __mocks__/              # Test mocks
├── config/
│   └── default.json            # Default configuration
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Configuration Schema

```typescript
interface AISecondOpinionConfig {
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
      apiKey: string;
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
```

## MCP Tools Implementation

### Tool 1: "ask_chatgpt_second_opinion"
- **Input**: `question` (string), `context` (optional string), `role` (optional string)
- **Output**: ChatGPT's response with metadata
- **Features**: Configurable prompt template, role-based responses

### Tool 2: "ask_gemini_third_opinion"
- **Input**: `question` (string), `context` (optional string), `role` (optional string)  
- **Output**: Gemini's response with metadata
- **Features**: Configurable prompt template, role-based responses

### Tool 3: "ask_ollama_local_opinion"
- **Input**: `question` (string), `context` (optional string), `role` (optional string), `model` (optional string)
- **Output**: Ollama's response with metadata
- **Features**: Local model execution, no API costs, configurable models

### Tool 4: "compare_ai_opinions"
- **Input**: `question` (string), `context` (optional string)
- **Output**: Responses from all enabled AIs with comparison
- **Features**: Side-by-side analysis, consensus detection, local vs cloud comparison

## AI Provider Abstractions

```typescript
abstract class AIProvider {
  abstract name: string;
  abstract isConfigured(): boolean;
  abstract generateResponse(prompt: string, role?: string): Promise<string>;
  abstract validateConfig(config: any): boolean;
}
```

## Key Features

### Configurable AI Roles
- **SEO Expert**: Optimizes content for search engines
- **Code Reviewer**: Reviews code quality and best practices
- **Security Analyst**: Identifies security vulnerabilities
- **UX Designer**: Provides user experience insights
- **Performance Expert**: Analyzes performance bottlenecks
- **Custom Roles**: User-defined roles via configuration

### Template System
- Customizable prompt templates per provider
- Role-specific prompt modifications
- Context injection capabilities
- Multi-language support potential

### Error Handling & Reliability
- Graceful fallbacks when APIs are unavailable
- Detailed error messages for debugging
- Retry logic with exponential backoff
- Circuit breaker pattern for failing services

### Security & Performance
- Rate limiting to prevent API abuse
- Input sanitization for all user inputs
- API keys stored securely in config files
- Request/response logging for debugging
- Memory-efficient streaming responses

## Testing Strategy

### Coverage Requirements
- **Target**: 80%+ test coverage
- **Framework**: Jest with TypeScript support
- **Mocking**: Comprehensive API mocking for reliable tests

### Test Categories

#### Unit Tests
- Configuration validation and loading
- Each AI provider implementation
- Tool handlers and utilities
- Input validation functions

#### Integration Tests
- Full MCP server workflows
- End-to-end tool execution
- Configuration hot-reloading
- Error scenario handling

#### Mock Tests
- API calls with controlled responses
- Network failure simulations
- Rate limiting behavior
- Authentication failures

### Test Data
- Realistic conversation scenarios
- Edge cases and error conditions
- Performance stress testing
- Security penetration testing

## Security Considerations

### API Key Management
- Configuration file storage (not hardcoded)
- Environment variable support
- Validation of API key format
- Secure error messages (no key leakage)

### Input Validation
- Sanitization of all user inputs
- Prevention of prompt injection attacks
- Length limits on requests
- Content filtering capabilities

### Network Security
- HTTPS-only API communications
- Request signing where supported
- Timeout configurations
- Connection pooling limits

## Development Workflow

### Phase 1: Setup (Days 1-2)
1. Project structure and dependencies
2. TypeScript configuration
3. Testing framework setup
4. Development scripts

### Phase 2: Core Infrastructure (Days 3-4)
1. Configuration system with validation
2. Abstract AI provider base class
3. Logging and utility functions
4. Basic error handling

### Phase 3: AI Integrations (Days 5-8)
1. OpenAI provider implementation
2. Google Gemini provider implementation
3. Ollama local model provider implementation
4. Role-based prompt systems
5. Response formatting and metadata handling

### Phase 4: MCP Server (Days 9-10)
1. MCP server setup and configuration
2. Tool definitions and handlers
3. Request/response processing
4. Integration with AI providers

### Phase 5: Testing & Quality (Days 11-13)
1. Unit test implementation
2. Integration test scenarios
3. Mock testing for APIs
4. Performance and security testing

### Phase 6: Documentation & Polish (Days 14-15)
1. README with usage examples
2. Configuration documentation
3. Troubleshooting guides
4. Final code review and cleanup

## Dependencies

### Core Dependencies
- `@modelcontextprotocol/sdk` - MCP framework
- `openai` - OpenAI API client
- `@google/generative-ai` - Gemini API client
- `ollama` - Ollama JavaScript client
- `zod` - Configuration validation schema

### Development Dependencies
- `typescript` - TypeScript compiler
- `jest` - Testing framework
- `@types/jest` - Jest type definitions
- `ts-jest` - TypeScript Jest transformer
- `winston` - Structured logging
- `dotenv` - Environment variable loading

### Optional Dependencies
- `axios` - HTTP client for custom integrations
- `rate-limiter-flexible` - Advanced rate limiting
- `node-cache` - Response caching
- `pm2` - Production process management

## Configuration Example

```json
{
  "providers": {
    "openai": {
      "enabled": true,
      "apiKey": "sk-...",
      "model": "gpt-4",
      "defaultRole": "helpful assistant",
      "customPrompt": "You are providing a second opinion to help solve technical problems."
    },
    "gemini": {
      "enabled": true,
      "apiKey": "AIza...",
      "model": "gemini-pro",
      "defaultRole": "technical expert",
      "customPrompt": "Provide a third opinion with focus on alternative solutions."
    },
    "ollama": {
      "enabled": true,
      "baseUrl": "http://localhost:11434",
      "model": "llama2",
      "defaultRole": "local AI assistant",
      "customPrompt": "You are a local AI providing cost-effective opinions on technical problems.",
      "timeout": 30000
    }
  },
  "tools": {
    "askChatGPT": {
      "name": "Ask ChatGPT for Second Opinion",
      "description": "Get a second opinion from ChatGPT on technical problems",
      "enabled": true
    },
    "askGemini": {
      "name": "Ask Gemini for Third Opinion",
      "description": "Get a third opinion from Google Gemini",
      "enabled": true
    },
    "askOllama": {
      "name": "Ask Ollama Local Model",
      "description": "Get a local AI opinion using Ollama (cost-free, private)",
      "enabled": true
    }
  },
  "logging": {
    "level": "info",
    "enabled": true
  }
}
```

## Success Metrics

### Functional Requirements
- ✅ Successfully integrate with OpenAI and Gemini APIs
- ✅ Provide configurable AI roles and prompts
- ✅ Handle errors gracefully with meaningful messages
- ✅ Support real-time configuration updates

### Quality Requirements
- ✅ Achieve 80%+ test coverage
- ✅ Response times under 10 seconds for typical queries
- ✅ Zero security vulnerabilities in dependencies
- ✅ Comprehensive documentation and examples

### Usage Requirements
- ✅ Easy installation and configuration
- ✅ Clear error messages and troubleshooting
- ✅ Seamless integration with Claude Code workflow
- ✅ Extensible architecture for future AI providers

## Future Enhancements

### Additional AI Providers
- Anthropic Claude API integration
- LocalAI server support
- Azure OpenAI Service
- Hugging Face API integration
- Custom webhook integrations

### Advanced Features
- Conversation history and context
- Multi-turn dialogue capabilities  
- Consensus analysis across multiple AIs
- Performance analytics and insights

### Enterprise Features
- Team collaboration tools
- Usage analytics and reporting
- Role-based access control
- Audit logging and compliance