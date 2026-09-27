import { PostgresAdapter } from 'js-record';
import { assertDatabaseUrl, databaseName } from './database-url.js';
import { ensureSchema } from './schema.js';

const databaseUrl = assertDatabaseUrl(process.env.DATABASE_URL);

const adapter = new PostgresAdapter({
  database: databaseName(databaseUrl),
  connectionString: databaseUrl,
});

await adapter.connect();
await ensureSchema(adapter);

export default adapter;
