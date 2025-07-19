import { describe, it, expect, vi } from 'vitest'
import { api } from '../services/api'
import type { Webhook } from '../types/webhook'

// Integration tests for the full flow including previewField functionality
describe('Integration Tests - PreviewField Feature', () => {
  // Mock fetch for these integration tests
  const mockFetch = vi.fn()
  globalThis.fetch = mockFetch

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Webhook with PreviewField Integration', () => {
    it('should create webhook with previewField and validate API flow', async () => {
      const webhookData = {
        path: 'shopify-orders',
        targetUrl: 'https://api.example.com/webhooks/orders',
        previewField: 'headers.x-shopify-topic'
      }

      const mockWebhook: Webhook = {
        id: 1,
        path: 'shopify-orders',
        targetUrl: 'https://api.example.com/webhooks/orders',
        previewField: 'headers.x-shopify-topic',
        active: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWebhook
      })

      const result = await api.createWebhook(
        webhookData.path,
        webhookData.targetUrl,
        webhookData.previewField
      )

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/webhooks'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            path: 'shopify-orders',
            targetUrl: 'https://api.example.com/webhooks/orders',
            previewField: 'headers.x-shopify-topic'
          })
        })
      )

      expect(result).toEqual(mockWebhook)
    })

    it('should update webhook previewField', async () => {
      const updateData = {
        path: 'shopify-orders',
        targetUrl: 'https://api.example.com/webhooks/orders',
        previewField: 'body.topic', // Changed from headers to body
        active: true
      }

      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      await api.updateWebhook(1, updateData)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/webhooks/1'),
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        })
      )
    })

    it('should fetch webhooks with previewField included', async () => {
      const mockWebhooks: Webhook[] = [
        {
          id: 1,
          path: 'shopify-orders',
          targetUrl: 'https://api.example.com/webhooks/orders',
          previewField: 'headers.x-shopify-topic',
          active: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          requestCount: 10
        },
        {
          id: 2,
          path: 'github-push',
          targetUrl: 'https://api.example.com/webhooks/github',
          previewField: 'body.action',
          active: true,
          createdAt: '2023-01-02T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          requestCount: 5
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWebhooks
      })

      const result = await api.getWebhooks()

      expect(result).toEqual(mockWebhooks)
      expect(result[0].previewField).toBe('headers.x-shopify-topic')
      expect(result[1].previewField).toBe('body.action')
    })

    it('should handle webhook creation without previewField', async () => {
      const mockWebhook: Webhook = {
        id: 3,
        path: 'simple-webhook',
        targetUrl: null,
        previewField: null,
        active: true,
        createdAt: '2023-01-03T00:00:00Z',
        updatedAt: '2023-01-03T00:00:00Z'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWebhook
      })

      const result = await api.createWebhook('simple-webhook', '')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/webhooks'),
        expect.objectContaining({
          body: JSON.stringify({
            path: 'simple-webhook',
            targetUrl: '',
            previewField: undefined
          })
        })
      )

      expect(result.previewField).toBeNull()
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully during webhook creation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict'
      })

      await expect(
        api.createWebhook('duplicate-path', 'https://example.com')
      ).rejects.toThrow('Failed to create webhook')
    })

    it('should handle network errors during webhook fetch', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(api.getWebhooks()).rejects.toThrow('Network error')
    })

    it('should handle invalid webhook update', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(
        api.updateWebhook(999, {
          path: 'nonexistent',
          targetUrl: 'https://example.com',
          active: true
        })
      ).rejects.toThrow('Failed to update webhook')
    })
  })

  describe('PreviewField Value Extraction Scenarios', () => {
    it('should handle various previewField patterns', () => {
      // This would be tested in the WebhookDetail component
      // but we can validate the patterns here
      const previewFieldPatterns = [
        'headers.x-event-type',
        'headers.x-shopify-topic',
        'body.action',
        'body.event.type',
        'body.data.customer.id',
        'queryParams.source',
        'queryParams.webhook_id'
      ]

      previewFieldPatterns.forEach(pattern => {
        const parts = pattern.split('.')
        expect(parts.length).toBeGreaterThanOrEqual(2)
        expect(['headers', 'body', 'queryParams']).toContain(parts[0])
      })
    })

    it('should validate previewField format constraints', () => {
      const validPatterns = [
        'headers.content-type',
        'body.event',
        'queryParams.source'
      ]

      const invalidPatterns = [
        'invalid.source',
        'headers', // Missing field name
        'body.', // Empty field name
        '.field' // Missing source
      ]

      validPatterns.forEach(pattern => {
        const [source, ...fieldParts] = pattern.split('.')
        expect(['headers', 'body', 'queryParams']).toContain(source)
        expect(fieldParts.join('.')).toBeTruthy()
      })

      invalidPatterns.forEach(pattern => {
        const [source, ...fieldParts] = pattern.split('.')
        const isValidSource = ['headers', 'body', 'queryParams'].includes(source)
        const hasValidField = fieldParts.join('.').length > 0
        expect(isValidSource && hasValidField).toBeFalsy()
      })
    })
  })

  describe('End-to-End Workflow', () => {
    it('should simulate complete webhook management workflow', async () => {
      // 1. Create webhook with previewField
      const createResponse = {
        id: 1,
        path: 'e2e-test',
        targetUrl: 'https://api.example.com/e2e',
        previewField: 'headers.x-event-type',
        active: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createResponse
      })

      const created = await api.createWebhook(
        'e2e-test',
        'https://api.example.com/e2e',
        'headers.x-event-type'
      )

      expect(created.previewField).toBe('headers.x-event-type')

      // 2. Update webhook previewField
      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      await api.updateWebhook(1, {
        previewField: 'body.event_type'
      })

      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/api/webhooks/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            previewField: 'body.event_type'
          })
        })
      )

      // 3. Fetch updated webhooks
      const fetchResponse = [
        {
          ...createResponse,
          previewField: 'body.event_type',
          updatedAt: '2023-01-01T01:00:00Z'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => fetchResponse
      })

      const webhooks = await api.getWebhooks()
      expect(webhooks[0].previewField).toBe('body.event_type')

      // 4. Delete webhook
      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      await api.deleteWebhook(1)

      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/api/webhooks/1'),
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    })
  })
})