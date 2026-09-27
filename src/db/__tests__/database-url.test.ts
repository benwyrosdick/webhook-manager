import { describe, expect, it } from 'vitest'
import { assertDatabaseUrl, databaseName } from '../database-url'

describe('assertDatabaseUrl', () => {
  it('accepts a passwordless local URL', () => {
    const url = 'postgresql://ben@localhost:5432/webhook_manager'
    expect(assertDatabaseUrl(url)).toBe(url)
    expect(databaseName(url)).toBe('webhook_manager')
  })

  it('accepts postgres:// and preserves sslmode', () => {
    const url = 'postgres://user:p%40ss@db.example.com:5432/webhook_manager?sslmode=require'
    expect(assertDatabaseUrl(url)).toBe(url)
    expect(databaseName(url)).toBe('webhook_manager')
  })

  it('rejects a missing URL', () => {
    expect(() => assertDatabaseUrl(undefined)).toThrow(/DATABASE_URL/)
  })

  it('rejects a URL without a database name', () => {
    expect(() => assertDatabaseUrl('postgresql://user@localhost:5432')).toThrow(/Invalid DATABASE_URL/)
  })
})
