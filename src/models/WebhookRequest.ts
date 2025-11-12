import { Model } from 'js-record';
import adapter from '../db/connection.js';

class WebhookRequest extends Model {
  static tableName = 'webhook_requests';
  
  id!: number;
  method!: string;
  url!: string;
  headers!: string | null;
  body!: string | null;
  queryParams!: string | null;
  timestamp!: Date;
  ipAddress!: string | null;
  userAgent!: string | null;
  relayStatus!: string | null;
  relayResponse!: string | null;
  webhookId!: number;
}

// Set the database adapter
Model.setAdapter(adapter);

// Define associations (after all models are loaded)
// WebhookRequest.belongsTo('webhook', () => import('./Webhook.js').then(m => m.default as typeof Model));

export default WebhookRequest;
