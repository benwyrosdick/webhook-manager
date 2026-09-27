interface Queryable {
  query: (sql: string, params?: unknown[]) => Promise<unknown>;
}

const statements = [
  `CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    path TEXT NOT NULL UNIQUE,
    target_url TEXT,
    preview_field TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS webhook_requests (
    id SERIAL PRIMARY KEY,
    method TEXT NOT NULL,
    url TEXT NOT NULL,
    headers TEXT,
    body TEXT,
    query_params TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    relay_status TEXT,
    relay_response TEXT,
    webhook_id INTEGER NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS webhook_requests_webhook_id_idx ON webhook_requests (webhook_id)`,
  `CREATE INDEX IF NOT EXISTS webhook_requests_timestamp_idx ON webhook_requests (timestamp DESC)`,
];

export async function ensureSchema(adapter: Queryable): Promise<void> {
  for (const statement of statements) {
    await adapter.query(statement, []);
  }
}
