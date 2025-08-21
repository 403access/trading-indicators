# API Refactoring Documentation

## Overview

The API has been completely refactored to provide better organization, type safety, and maintainability. This document outlines the new structure and how to use it.

## 📁 Project Structure

```
src/
├── packages/
│   ├── env/                    # Centralized environment configuration
│   │   └── index.ts
│   ├── frontend-env/           # Frontend-specific environment variables
│   │   └── index.ts
│   ├── api/                    # API handlers and utilities
│   │   ├── index.ts           # Main exports
│   │   ├── utils.ts           # API utilities and types
│   │   └── handlers/
│   │       ├── trades.ts      # Trades API handlers
│   │       └── users.ts       # Users API handlers
│   ├── api-client/            # Frontend API client
│   │   └── index.ts
│   └── ...
├── apps/
│   └── backend/
│       └── main.ts            # Simplified server setup
└── scripts/
    ├── test-refactor.ts       # Test the refactored structure
    └── ...
```

## 🔧 Environment Variables

### Backend Environment (`.env`)

```bash
# Server Configuration
SERVER_HOST=localhost
SERVER_PORT=3000
NODE_ENV=development

# Kraken API
API_KEY=your_kraken_api_key
API_PRIVATE_KEY=your_kraken_private_key

# Database
DATABASE_PATH=./data/trades.db
```

### Frontend Environment (`BUN_PUBLIC_*`)

Variables prefixed with `BUN_PUBLIC_` are accessible in the browser:

```bash
BUN_PUBLIC_APP_NAME=Trading Indicators
BUN_PUBLIC_APP_VERSION=1.0.0
BUN_PUBLIC_ENABLE_DEBUG=true
BUN_PUBLIC_ENABLE_ANALYTICS=false
```

## 🌍 Environment Configuration

### Backend Usage

```typescript
import { ENV, validateEnv, getEnvInfo } from '#/packages/env';

// Validate on startup
validateEnv();

// Access environment variables
const port = ENV.SERVER_PORT;
const isDev = ENV.DEVELOPMENT;
```

### Frontend Usage

```typescript
import { PUBLIC_ENV, getAppConfig } from '#/packages/frontend-env';

// Access public environment variables
const apiUrl = PUBLIC_ENV.API_BASE_URL;
const appName = PUBLIC_ENV.APP_NAME;

// Get full app configuration
const config = getAppConfig();
```

## 🔌 API Handlers

### Creating New Handlers

```typescript
// src/packages/api/handlers/example.ts
import { type ApiHandler, createSuccessResponse, withErrorHandling } from '../utils';

const getExampleHandler = withErrorHandling(async (req: Request): Promise<Response> => {
  const data = { message: 'Hello World' };
  return createSuccessResponse(data);
});

export const exampleHandlers: Record<string, ApiHandler> = {
  '/api/example': {
    GET: getExampleHandler,
  },
};
```

### API Utilities

```typescript
import {
  createSuccessResponse,
  createErrorResponse,
  withErrorHandling,
  requireAuth,
  parseQueryParams,
} from '#/packages/api/utils';

// Create standardized responses
const success = createSuccessResponse({ data: 'example' });
const error = createErrorResponse('Something went wrong', 400);

// Wrap handlers with error handling
const handler = withErrorHandling(async (req) => {
  // Your handler logic
  return createSuccessResponse(result);
});

// Check authentication
const authError = requireAuth(apiKey, privateKey);
if (authError) return authError;

// Parse query parameters
const url = new URL(req.url);
const params = parseQueryParams(url);
```

## 🌐 Frontend API Client

### Usage

```typescript
import { apiClient, handleApiResponse } from '#/packages/api-client';

// Get trades
const tradesResponse = await apiClient.trades.list({
  limit: 10,
  offset: 0,
  refresh: true
});
const trades = handleApiResponse(tradesResponse);

// Trigger sync
const syncResponse = await apiClient.trades.sync();
const syncResult = handleApiResponse(syncResponse);

// Get service info
const infoResponse = await apiClient.trades.info();
const info = handleApiResponse(infoResponse);
```

### Custom Requests

```typescript
// Direct API calls
const response = await apiClient.get('/api/custom-endpoint');
const data = await apiClient.post('/api/custom-endpoint', { key: 'value' });
```

## 🧪 Testing

### Test Scripts

```bash
# Test the refactored structure
bun run test:refactor

# Test rate limiting
bun run test:ratelimit

# Test database status
bun run db:status
```

### Running Tests

```typescript
// Test environment configuration
import { validateEnv } from '#/packages/env';
validateEnv(); // Throws if required vars are missing

// Test API handlers
import { apiHandlers } from '#/packages/api';
console.log(Object.keys(apiHandlers)); // List all endpoints
```

## 🔒 Security

- **Environment Validation**: Required variables are validated on startup
- **Authentication**: Centralized auth checking with `requireAuth()`
- **Error Handling**: Consistent error responses without leaking sensitive data
- **Type Safety**: Full TypeScript support for all API interactions

## 🚀 Development

### Adding New Endpoints

1. **Create handler file**: `src/packages/api/handlers/new-feature.ts`
2. **Define handlers**: Export handlers object with your endpoints
3. **Add to index**: Import and spread in `src/packages/api/index.ts`
4. **Update client**: Add methods to `src/packages/api-client/index.ts`

### Environment Variables

1. **Backend**: Add to `ENV` object in `src/packages/env/index.ts`
2. **Frontend**: Add with `BUN_PUBLIC_` prefix to `PUBLIC_ENV`
3. **Document**: Update `.env.example` with new variables

## 📊 Benefits

- ✅ **Separation of Concerns**: Clear separation between handlers, utilities, and configuration
- ✅ **Type Safety**: Full TypeScript support throughout
- ✅ **Centralized Config**: Single source of truth for environment variables
- ✅ **Error Handling**: Consistent error responses and logging
- ✅ **Frontend Integration**: Easy-to-use API client for frontend
- ✅ **Testing**: Comprehensive test utilities and scripts
- ✅ **Security**: Built-in authentication and validation
- ✅ **Maintainability**: Modular structure that's easy to extend
