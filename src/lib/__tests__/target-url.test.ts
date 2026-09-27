import { describe, expect, it } from 'vitest'
import { targetUrlError } from '../target-url'

describe('targetUrlError', () => {
  it('allows an empty target', () => {
    expect(targetUrlError('')).toBeNull()
    expect(targetUrlError('   ')).toBeNull()
  })

  it('allows public https URLs and private LAN addresses', () => {
    expect(targetUrlError('https://example.com/hook')).toBeNull()
    expect(targetUrlError('http://192.168.1.20:8080/hook')).toBeNull()
  })

  it('rejects non-http protocols, localhost, and metadata addresses', () => {
    expect(targetUrlError('file:///etc/passwd')).toMatch(/http/)
    expect(targetUrlError('http://localhost/hook')).toMatch(/not allowed/)
    expect(targetUrlError('http://127.0.0.1/hook')).toMatch(/not allowed/)
    expect(targetUrlError('http://169.254.169.254/latest')).toMatch(/not allowed/)
    expect(targetUrlError('not a url')).toMatch(/valid http/)
  })
})