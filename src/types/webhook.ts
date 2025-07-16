export interface WebhookRequest {
  id: number;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  query_params: Record<string, string>;
  timestamp: string;
  ip_address: string;
  user_agent: string;
}

export interface URLMapping {
  id: number;
  webhook_path: string;
  target_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}