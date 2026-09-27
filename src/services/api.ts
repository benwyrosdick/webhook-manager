import type { WebhookRequest, Webhook } from '../types/webhook';

function apiBase(): string {
  const configured = import.meta.env.VITE_API_BASE;
  if (typeof configured === 'string' && configured.trim()) {
    return configured.trim().replace(/\/$/, '');
  }
  return '';
}

async function errorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
      return data.error;
    }
  } catch {
    // The response has no JSON body.
  }
  return fallback;
}

export const api = {
  // Webhook requests
  getRequests: async (limit = 100, offset = 0, webhookId?: number): Promise<WebhookRequest[]> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });
    if (webhookId) {
      params.append('webhookId', webhookId.toString());
    }
    const response = await fetch(`${apiBase()}/api/requests?${params}`);
    if (!response.ok) throw new Error(await errorMessage(response, 'Failed to fetch requests'));
    return response.json();
  },

  getRequest: async (id: number): Promise<WebhookRequest> => {
    const response = await fetch(`${apiBase()}/api/requests/${id}`);
    if (!response.ok) throw new Error(await errorMessage(response, 'Failed to fetch request'));
    return response.json();
  },

  deleteRequest: async (id: number): Promise<void> => {
    const response = await fetch(`${apiBase()}/api/requests/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(await errorMessage(response, 'Failed to delete request'));
  },

  clearAllRequests: async (): Promise<void> => {
    const response = await fetch(`${apiBase()}/api/requests`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(await errorMessage(response, 'Failed to clear requests'));
  },

  resendRequest: async (id: number): Promise<{ message: string; success: boolean; status: number; error?: string }> => {
    const response = await fetch(`${apiBase()}/api/requests/${id}/resend`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error(await errorMessage(response, 'Failed to resend request'));
    return response.json();
  },

  // Webhooks (new API)
  getWebhooks: async (): Promise<Webhook[]> => {
    const response = await fetch(`${apiBase()}/api/webhooks`);
    if (!response.ok) throw new Error(await errorMessage(response, 'Failed to fetch webhooks'));
    return response.json();
  },

  createWebhook: async (path: string, targetUrl: string, previewField?: string): Promise<Webhook> => {
    const response = await fetch(`${apiBase()}/api/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, targetUrl, previewField }),
    });
    if (!response.ok) throw new Error(await errorMessage(response, 'Failed to create webhook'));
    return response.json();
  },

  updateWebhook: async (id: number, data: Partial<Webhook>): Promise<void> => {
    const response = await fetch(`${apiBase()}/api/webhooks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await errorMessage(response, 'Failed to update webhook'));
  },

  deleteWebhook: async (id: number): Promise<void> => {
    const response = await fetch(`${apiBase()}/api/webhooks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(await errorMessage(response, 'Failed to delete webhook'));
  },

  clearWebhookRequests: async (webhookId: number): Promise<void> => {
    const response = await fetch(`${apiBase()}/api/webhooks/${webhookId}/requests`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(await errorMessage(response, 'Failed to clear requests'));
  },
};