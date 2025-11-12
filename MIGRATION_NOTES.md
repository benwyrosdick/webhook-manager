# Migration from Prisma to js-record

This document describes the migration from Prisma to js-record ORM.

## Changes Made

### 1. Dependencies
- **Removed**: `@prisma/client`, `prisma`
- **Added**: `js-record@0.1.0`

### 2. Database Connection
- Created `src/db/connection.ts` (TypeScript) with PostgresAdapter configuration
- Parses `DATABASE_URL` environment variable (same as Prisma)
- Connection is established at module load time
- Includes proper TypeScript types for connection parameters

### 3. Models
Created two TypeScript model files in `src/models/`:

#### `Webhook.ts`
- Maps to `webhooks` table
- Properties use snake_case for database columns with camelCase getters/setters
- Full TypeScript type definitions with non-null assertions
- Relationship: `hasMany('requests', WebhookRequest)` (commented out pending js-record type fixes)

#### `WebhookRequest.ts`  
- Maps to `webhook_requests` table
- Properties use snake_case for database columns with camelCase getters/setters
- Full TypeScript type definitions with non-null assertions
- Relationship: `belongsTo('webhook', Webhook)` (commented out pending js-record type fixes)

### 4. Query Migration
All Prisma queries were replaced with js-record equivalents:

| Prisma | js-record |
|--------|-----------|
| `prisma.webhook.findFirst({ where: { ... } })` | `Webhook.findBy({ ... })` or `Webhook.where({ ... }).first()` |
| `prisma.webhook.findMany({ orderBy: { ... } })` | `Webhook.orderBy('field', 'DESC').all()` |
| `prisma.webhook.create({ data: { ... } })` | `Webhook.create({ ... })` |
| `prisma.webhook.update({ where: { ... }, data: { ... } })` | `webhook.update({ ... })` (instance method) |
| `prisma.webhook.delete({ where: { ... } })` | `webhook.destroy()` (instance method) |
| `prisma.webhookRequest.findUnique({ where: { id } })` | `WebhookRequest.find(id)` |
| `prisma.webhookRequest.count()` | `WebhookRequest.where({ ... }).count()` |

### 5. Removed Files
- `prisma/` directory (schema and migrations)
- `prisma-client.js`
- `generated/` directory
- Prisma-related npm scripts from package.json

### 6. Backup Files
- `server-prisma.js.bak` - Original server.js with Prisma
- `server.js.backup` - Another backup of original server.js

## Database Schema Notes

The database tables remain unchanged:
- Table names: `webhooks`, `webhook_requests`
- Column names: snake_case (e.g., `target_url`, `created_at`, `webhook_id`)
- The existing PostgreSQL database and data are preserved

## Running the Application

### Prerequisites
You need a `.env` file with your database connection:

```bash
cp .env.example .env
# Edit .env and set your DATABASE_URL
```

### Start the application

```bash
# Development (with auto-reload)
bun run dev

# Production
bun run start
```

## Migration Notes

### Column Name Mapping
The models use snake_case property names matching the database columns, with camelCase getters/setters for convenience:
- Database column: `target_url`
- Direct access: `webhook.target_url`
- Camel case access: `webhook.targetUrl`

### Removed Features
- `url_mappings` table endpoints now return 410 Gone (this table was removed in a previous migration)
- Prisma Studio is no longer available
- No prisma migrate or generate scripts

### Database Migrations
Since js-record doesn't have built-in migrations, you'll need to manage schema changes manually via SQL or use a migration tool like:
- Raw SQL scripts
- node-pg-migrate
- db-migrate
- Or js-record's migration system (if/when available)

### Associations
Associations are defined but may require testing:
- `webhook.requests` - get all requests for a webhook
- `webhookRequest.webhook` - get the webhook for a request

Note: js-record association loading may work differently than Prisma's include/select.

## Testing

After migration, test these key features:
1. Receiving webhooks via `/webhook/*`
2. Creating/updating/deleting webhooks via `/api/webhooks`
3. Viewing webhook requests via `/api/requests`
4. Resending webhook requests via `/api/requests/:id/resend`

## Rollback

If you need to rollback to Prisma:
1. Restore `server-prisma.js.bak` to `server.js`
2. `bun add @prisma/client prisma`
3. Restore prisma directory from git history
4. Run `bun prisma generate`
5. Restore Prisma scripts in package.json
