import { PostgresAdapter } from 'js-record';

interface ConnectionParams {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

// Parse DATABASE_URL to get connection parameters
const parseConnectionString = (url: string | undefined): ConnectionParams => {
  if (!url) {
    throw new Error(
      'DATABASE_URL environment variable is not set.\n' +
      'Please create a .env file with DATABASE_URL or run with: dotenv -- bun server.js'
    );
  }
  
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format. Expected: postgresql://user:password@host:port/database');
  }
  
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5]
  };
};

const connectionParams = parseConnectionString(process.env.DATABASE_URL);

const adapter = new PostgresAdapter({
  host: connectionParams.host,
  port: connectionParams.port,
  database: connectionParams.database,
  user: connectionParams.user,
  password: connectionParams.password,
});

// Connect to the database
await adapter.connect();

export default adapter;
