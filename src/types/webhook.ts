export interface WebhookRequest {
  id: number;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  queryParams: Record<string, string>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  relayStatus?: string;
  relayResponse?: string;
  webhookId: number;
}

export interface Webhook {
  id: number;
  path: string;
  targetUrl?: string | null;
  previewField?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  requests?: WebhookRequest[];
  requestCount?: number;
}

// Legacy interface for backward compatibility
export interface URLMapping {
  id: number;
  webhook_path: string;
  target_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}