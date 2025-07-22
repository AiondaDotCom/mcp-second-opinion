# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that provides AI second opinion tools, allowing users to get responses from multiple AI providers (OpenAI, Gemini, Claude CLI, Ollama) and compare their outputs. The server exposes tools through the MCP protocol for integration with Claude Desktop and other MCP clients.

## Development Commands

- `npm run build` - Compile TypeScript to dist/ directory
- `npm run test` - Run Jest test suite with TypeScript support
- `node dist/server/index.js` - Run the MCP server (after building)

The MCP server binary is configured in package.json as `dist/server/index.js` and referenced in `mcp.json` for Claude Desktop integration.

## Core Architecture

### Provider Pattern
The codebase uses a clean provider abstraction pattern:
- `src/providers/base.ts` - Abstract `AIProvider` base class defining the interface
- `src/providers/openai.ts`, `src/providers/gemini.ts`, `src/providers/claude.ts`, `src/providers/ollama.ts` - Concrete implementations
- Each provider handles authentication, API calls, and response formatting consistently

### MCP Server Structure
- `src/server/index.ts` - Main MCP server initialization and stdio transport setup
- `src/server/handlers.ts` - Request/response handlers for MCP protocol methods
- `src/server/tools.ts` - Tool definitions and execution logic for the five main tools:
  - `ask_chatgpt_second_opinion` - OpenAI GPT responses
  - `ask_gemini_third_opinion` - Google Gemini responses
  - `ask_claude_fourth_opinion` - Claude CLI responses
  - `ask_ollama_local_opinion` - Local Ollama model responses
  - `compare_ai_opinions` - Side-by-side comparison of multiple providers

### Configuration System
- `src/config/schema.ts` - Zod schemas for type-safe configuration validation
- `src/config/loader.ts` - Configuration loading with environment variable support
- `config/default.json` - Runtime configuration including API keys, model settings, and tool descriptions
- Configuration is validated at startup and passed to providers and tools

### Key Utilities
- `src/utils/logger.ts` - Winston-based logging with configurable levels
- `src/utils/validation.ts` - Input validation helpers using Zod schemas
- `src/types/index.ts` - TypeScript type definitions for providers, tools, and configurations

## Configuration Management

The server uses a layered configuration approach:
1. Base configuration in `config/default.json`
2. Environment variable overrides (API keys should be set via env vars)
3. Runtime validation using Zod schemas

## Environment Setup

Before running the server, set these environment variables:
```bash
export OPENAI_API_KEY="your_openai_api_key"
export OLLAMA_BASE_URL="http://localhost:11434"  # optional, defaults to localhost
```

**Gemini Setup:** The server now uses the Gemini CLI tool instead of direct API calls. Make sure you have the Gemini CLI installed and authenticated:
```bash
# Install Gemini CLI if not already installed
npm install -g @google/generative-ai-cli

# Authenticate (this will open a browser for login)
gemini auth login
```

**Claude Setup:** The server uses the Claude CLI tool which should be available if you're running this. No additional setup required:
```bash
# Verify Claude CLI is available
claude --version
```

Copy `.env.example` to `.env` and add your OpenAI key, or set it directly in your shell.

## Testing Structure

- `tests/unit/` - Unit tests for individual components
- `tests/integration/` - Integration tests for full workflows
- `tests/__mocks__/` - Jest mocks for external dependencies
- Uses ts-jest for TypeScript support in Jest

## Key Development Patterns

- All providers implement the same `generateResponse(prompt: string)` interface
- Error handling follows consistent patterns with proper error types
- Configuration changes don't require code changes - modify `config/default.json`
- New AI providers can be added by extending the `AIProvider` base class
- All external API calls and CLI commands are properly wrapped with error handling and logging
- The Claude provider uses the Claude CLI with `--print` flag for non-interactive responses