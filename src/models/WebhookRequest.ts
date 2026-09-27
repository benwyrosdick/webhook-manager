import { Model } from 'js-record';
import adapter from '../db/connection.js';

class WebhookRequest extends Model {
  // This table stores its own timestamp column and has no created_at/updated_at.
  static config = {
    tableName: 'webhook_requests',
    primaryKey: 'id',
    timestamps: false,
    mapAttributes: true,
  };

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

Model.setAdapter(adapter);

export default WebhookRequest;
