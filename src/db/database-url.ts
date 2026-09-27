// Accepts the forms Postgres actually uses, including passwordless local URLs
// and sslmode query parameters. The previous regex rejected both.
export function assertDatabaseUrl(url: string | undefined): string {
  if (!url || !url.trim()) {
    throw new Error(
      'DATABASE_URL environment variable is not set.\n' +
        'Add it to .env, for example:\n' +
        'DATABASE_URL=postgresql://user@localhost:5432/webhook_manager'
    );
  }

  const trimmed = url.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(
      'Invalid DATABASE_URL. Expected postgresql://user:password@host:port/database'
    );
  }

  if (parsed.protocol !== 'postgresql:' && parsed.protocol !== 'postgres:') {
    throw new Error(
      'Invalid DATABASE_URL. Expected postgresql://user:password@host:port/database'
    );
  }

  const database = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  if (!parsed.hostname || !database) {
    throw new Error(
      'Invalid DATABASE_URL. Expected postgresql://user:password@host:port/database'
    );
  }

  return trimmed;
}

export function databaseName(url: string): string {
  const parsed = new URL(url);
  return decodeURIComponent(parsed.pathname.replace(/^\//, ''));
}
