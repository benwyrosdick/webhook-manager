import type { WebhookRequest, Webhook, URLMapping } from '../types/webhook';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export const api = {
  // Webhook requests
  getRequests: async (limit = 100, offset = 0): Promise<WebhookRequest[]> => {
    const response = await fetch(`${API_BASE}/api/requests?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Failed to fetch requests');
    return response.json();
  },

  getRequest: async (id: number): Promise<WebhookRequest> => {
    const response = await fetch(`${API_BASE}/api/requests/${id}`);
    if (!response.ok) throw new Error('Failed to fetch request');
    return response.json();
  },

  deleteRequest: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/requests/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete request');
  },

  clearAllRequests: async (): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/requests`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear requests');
  },

  resendRequest: async (id: number): Promise<{ message: string; success: boolean; status: number; error?: string }> => {
    const response = await fetch(`${API_BASE}/api/requests/${id}/resend`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to resend request');
    return response.json();
  },

  // Webhooks (new API)
  getWebhooks: async (): Promise<Webhook[]> => {
    const response = await fetch(`${API_BASE}/api/webhooks`);
    if (!response.ok) throw new Error('Failed to fetch webhooks');
    return response.json();
  },

  createWebhook: async (path: string, targetUrl: string): Promise<Webhook> => {
    const response = await fetch(`${API_BASE}/api/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, targetUrl }),
    });
    if (!response.ok) throw new Error('Failed to create webhook');
    return response.json();
  },

  updateWebhook: async (id: number, data: Partial<Webhook>): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/webhooks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update webhook');
  },

  deleteWebhook: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/webhooks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete webhook');
  },

  // URL mappings (legacy API for backward compatibility)
  getMappings: async (): Promise<URLMapping[]> => {
    const response = await fetch(`${API_BASE}/api/mappings`);
    if (!response.ok) throw new Error('Failed to fetch mappings');
    return response.json();
  },

  createMapping: async (webhook_path: string, target_url: string): Promise<URLMapping> => {
    const response = await fetch(`${API_BASE}/api/mappings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ webhook_path, target_url }),
    });
    if (!response.ok) throw new Error('Failed to create mapping');
    return response.json();
  },

  updateMapping: async (id: number, data: Partial<URLMapping>): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/mappings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update mapping');
  },

  deleteMapping: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/mappings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete mapping');
  },
};