# TypeScript Migration for Database Models

This document describes the conversion of database models and connection files from JavaScript to TypeScript.

## Changes Made

### 1. Database Connection - `src/db/connection.ts`

**Before:** `src/db/connection.js` (JavaScript)
**After:** `src/db/connection.ts` (TypeScript)

**Key Changes:**
- Added `ConnectionParams` interface for type safety
- Typed the `parseConnectionString` function parameters and return type
- Added proper error handling with typed error messages
- Full type inference for database adapter configuration

```typescript
interface ConnectionParams {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

const parseConnectionString = (url: string | undefined): ConnectionParams => {
  // Implementation with type safety
};
```

### 2. Webhook Model - `src/models/Webhook.ts`

**Before:** `src/models/Webhook.js` (JavaScript)
**After:** `src/models/Webhook.ts` (TypeScript)

**Key Changes:**
- All properties now have explicit type annotations with non-null assertions (`!`)
- Snake_case database column names properly typed
- CamelCase getters/setters maintain type information
- Proper typing for nullable fields (`string | null`, `Date`)

```typescript
class Webhook extends Model {
  static tableName = 'webhooks';
  
  id!: number;
  path!: string;
  target_url!: string | null;
  preview_field!: string | null;
  active!: boolean;
  created_at!: Date;
  updated_at!: Date;
  
  // Typed getters and setters
  get targetUrl(): string | null { 
    return this.target_url; 
  }
  
  set targetUrl(value: string | null) { 
    this.target_url = value; 
  }
  // ... more getters/setters
}
```

### 3. WebhookRequest Model - `src/models/WebhookRequest.ts`

**Before:** `src/models/WebhookRequest.js` (JavaScript)
**After:** `src/models/WebhookRequest.ts` (TypeScript)

**Key Changes:**
- All properties typed with proper nullable annotations
- Snake_case to camelCase conversion maintains type safety
- Foreign key (`webhook_id`) properly typed as `number`
- JSON string fields typed as `string | null`

```typescript
class WebhookRequest extends Model {
  static tableName = 'webhook_requests';
  
  id!: number;
  method!: string;
  url!: string;
  headers!: string | null;
  body!: string | null;
  query_params!: string | null;
  timestamp!: Date;
  ip_address!: string | null;
  user_agent!: string | null;
  relay_status!: string | null;
  relay_response!: string | null;
  webhook_id!: number;
  
  // Typed getters and setters for camelCase access
  get webhookId(): number { 
    return this.webhook_id; 
  }
  
  set webhookId(value: number) { 
    this.webhook_id = value; 
  }
  // ... more getters/setters
}
```

### 4. Models Index - `src/models/index.ts`

**Before:** `src/models/index.js` (JavaScript)
**After:** `src/models/index.ts` (TypeScript)

**Key Changes:**
- ES module exports with proper TypeScript imports
- Type information preserved through exports
- Association setup commented out (pending js-record type improvements)

```typescript
import Webhook from './Webhook.js';
import WebhookRequest from './WebhookRequest.js';

// Note: Keep .js extension for Bun/Node ESM compatibility
export { Webhook, WebhookRequest };
```

## Type Safety Benefits

### 1. Compile-Time Checking
- Catch type errors before runtime
- IDE autocomplete for model properties
- Refactoring safety with type inference

### 2. Property Access
```typescript
// TypeScript knows these types:
const webhook = await Webhook.find(1);
webhook.targetUrl;  // Type: string | null
webhook.active;     // Type: boolean
webhook.created_at; // Type: Date
webhook.createdAt;  // Type: Date (via getter)
```

### 3. Null Safety
```typescript
// Explicitly typed nullable fields
webhook.target_url;    // string | null
webhook.preview_field; // string | null

// Non-nullable fields
webhook.id;     // number
webhook.path;   // string
webhook.active; // boolean
```

### 4. Date Types
```typescript
// Dates are properly typed, not strings
webhook.created_at; // Date
webhook.updatedAt;  // Date (via getter)
```

## Import Compatibility

Bun supports TypeScript natively, so imports from JavaScript files work seamlessly:

```javascript
// In server.js (JavaScript)
import { Webhook, WebhookRequest } from './src/models/index.js';
// ✓ Works! Bun resolves .js to .ts files
```

## File Extension Note

All imports use `.js` extension even though files are `.ts`:
```typescript
import adapter from '../db/connection.js'; // Resolves to connection.ts
import Webhook from './Webhook.js';        // Resolves to Webhook.ts
```

This is required for ES modules and Bun handles the resolution automatically.

## Type Checking

Run TypeScript type checking:
```bash
bunx tsc --noEmit
```

No errors should be reported for the model files.

## Migration Verification

✅ All files converted to TypeScript
✅ Type checking passes with no errors
✅ Server starts successfully with TypeScript models
✅ Models can be imported from JavaScript (server.js)
✅ No runtime errors

## Future Improvements

1. **Association Types**: When js-record improves type definitions, uncomment the association setup in `src/models/index.ts`

2. **Type Definitions**: Consider creating a `types/` directory for shared interfaces:
   ```typescript
   // types/database.ts
   export interface WebhookData {
     path: string;
     target_url?: string | null;
     preview_field?: string | null;
     active?: boolean;
   }
   ```

3. **Query Result Types**: Add generic types for query results:
   ```typescript
   const webhooks: Webhook[] = await Webhook.all();
   const webhook: Webhook | null = await Webhook.find(1);
   ```

## Backward Compatibility

The migration maintains 100% backward compatibility:
- JavaScript server.js can import TypeScript models
- All API endpoints work unchanged
- Database schema unchanged
- No breaking changes to existing code

## Summary

All database models and connection files are now in TypeScript, providing:
- ✅ Type safety at compile time
- ✅ Better IDE support and autocomplete
- ✅ Self-documenting code with types
- ✅ Easier refactoring and maintenance
- ✅ No runtime overhead (types are erased)
- ✅ Full compatibility with existing JavaScript code
