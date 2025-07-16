import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'webhook.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Webhook requests table
  db.run(`
    CREATE TABLE IF NOT EXISTS webhook_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      method TEXT NOT NULL,
      url TEXT NOT NULL,
      headers TEXT,
      body TEXT,
      query_params TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT
    )
  `);

  // URL mappings table for forwarding
  db.run(`
    CREATE TABLE IF NOT EXISTS url_mappings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      webhook_path TEXT UNIQUE NOT NULL,
      target_url TEXT NOT NULL,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;