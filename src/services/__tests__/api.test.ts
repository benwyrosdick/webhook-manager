import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from '../api'
import type { WebhookRequest, URLMapping } from '../../types/webhook'

// Mock fetch
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

const API_BASE = 'http://localhost:3001'

describe('API Service', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('Webhook Requests', () => {
    it('should fetch requests with default parameters', async () => {
      const mockRequests: WebhookRequest[] = [
        {
          id: 1,
          method: 'POST',
          url: '/webhook/test',
          headers: { 'content-type': 'application/json' },
          body: '{"test": true}',
          query_params: {},
          ip_address: '127.0.0.1',
          user_agent: 'test-agent',
          timestamp: '2023-01-01T00:00:00Z'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRequests
      })

      const result = await api.getRequests()

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/requests?limit=100&offset=0`)
      expect(result).toEqual(mockRequests)
    })

    it('should fetch requests with custom parameters', async () => {
      const mockRequests: WebhookRequest[] = []

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRequests
      })

      await api.getRequests(50, 10)

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/requests?limit=50&offset=10`)
    })

    it('should fetch a single request by ID', async () => {
      const mockRequest: WebhookRequest = {
        id: 1,
        method: 'POST',
        url: '/webhook/test',
        headers: { 'content-type': 'application/json' },
        body: '{"test": true}',
        query_params: {},
        ip_address: '127.0.0.1',
        user_agent: 'test-agent',
        timestamp: '2023-01-01T00:00:00Z'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRequest
      })

      const result = await api.getRequest(1)

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/requests/1`)
      expect(result).toEqual(mockRequest)
    })

    it('should delete a request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      await api.deleteRequest(1)

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/requests/1`, {
        method: 'DELETE'
      })
    })

    it('should clear all requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      await api.clearAllRequests()

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/requests`, {
        method: 'DELETE'
      })
    })

    it('should resend a request', async () => {
      const mockResponse = {
        message: 'Request resent',
        success: true,
        status: 200
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await api.resendRequest(1)

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/requests/1/resend`, {
        method: 'POST'
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(api.getRequest(999)).rejects.toThrow('Failed to fetch request')
    })
  })

  describe('URL Mappings', () => {
    it('should fetch mappings', async () => {
      const mockMappings: URLMapping[] = [
        {
          id: 1,
          webhook_path: 'test',
          target_url: 'https://example.com/webhook',
          active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMappings
      })

      const result = await api.getMappings()

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/mappings`)
      expect(result).toEqual(mockMappings)
    })

    it('should create a mapping', async () => {
      const mockMapping: URLMapping = {
        id: 1,
        webhook_path: 'test',
        target_url: 'https://example.com/webhook',
        active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMapping
      })

      const result = await api.createMapping('test', 'https://example.com/webhook')

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/mappings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          webhook_path: 'test',
          target_url: 'https://example.com/webhook'
        })
      })
      expect(result).toEqual(mockMapping)
    })

    it('should update a mapping', async () => {
      const updateData = {
        webhook_path: 'updated-test',
        target_url: 'https://updated.com/webhook',
        active: false
      }

      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      await api.updateMapping(1, updateData)

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/mappings/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
    })

    it('should delete a mapping', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      await api.deleteMapping(1)

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/mappings/1`, {
        method: 'DELETE'
      })
    })

    it('should throw error when mapping creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409
      })

      await expect(api.createMapping('test', 'https://example.com/webhook'))
        .rejects.toThrow('Failed to create mapping')
    })
  })
})