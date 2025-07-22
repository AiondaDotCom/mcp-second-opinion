#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  CallToolResult
} from '@modelcontextprotocol/sdk/types.js';
import { tools } from './tools.js';
import * as handlers from './handlers.js';
import logger from '../utils/logger.js';

// Create server instance with proper configuration
const server = new Server(
  {
    name: 'mcp-second-opinion',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {} // Enable tools capability
    }
  }
);

// Handle tools/list requests
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: tools.ask_chatgpt_second_opinion.name,
        description: tools.ask_chatgpt_second_opinion.description,
        inputSchema: tools.ask_chatgpt_second_opinion.inputSchema
      },
      {
        name: tools.ask_gemini_third_opinion.name,
        description: tools.ask_gemini_third_opinion.description,
        inputSchema: tools.ask_gemini_third_opinion.inputSchema
      },
      {
        name: tools.ask_ollama_local_opinion.name,
        description: tools.ask_ollama_local_opinion.description,
        inputSchema: tools.ask_ollama_local_opinion.inputSchema
      },
      {
        name: tools.ask_claude_fourth_opinion.name,
        description: tools.ask_claude_fourth_opinion.description,
        inputSchema: tools.ask_claude_fourth_opinion.inputSchema
      },
      {
        name: tools.compare_ai_opinions.name,
        description: tools.compare_ai_opinions.description,
        inputSchema: tools.compare_ai_opinions.inputSchema
      }
    ]
  };
});

// Handle tools/call requests
server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
  const { name, arguments: args } = request.params;
  
  try {
    let result;
    switch (name) {
      case tools.ask_chatgpt_second_opinion.name:
        result = await handlers.askChatGPT(args || {});
        break;
      case tools.ask_gemini_third_opinion.name:
        result = await handlers.askGemini(args || {});
        break;
      case tools.ask_ollama_local_opinion.name:
        result = await handlers.askOllama(args || {});
        break;
      case tools.ask_claude_fourth_opinion.name:
        result = await handlers.askClaude(args || {});
        break;
      case tools.compare_ai_opinions.name:
        result = await handlers.compareAIOpinions(args || {});
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    
    // Return result in the correct format
    if (result.error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${result.error}`
          }
        ],
        isError: true
      };
    } else {
      return {
        content: [
          {
            type: 'text',
            text: typeof result.response === 'string' ? result.response : JSON.stringify(result)
          }
        ]
      };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ],
      isError: true
    };
  }
});

// Set up stdio transport and connect
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('MCP AI Second Opinion Server started with stdio transport');
}

main().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});