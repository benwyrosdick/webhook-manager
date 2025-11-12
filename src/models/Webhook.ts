import { Model } from 'js-record';
import adapter from '../db/connection.js';

class Webhook extends Model {
  static tableName = 'webhooks';
  
  id!: number;
  path!: string;
  targetUrl!: string | null;
  previewField!: string | null;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

// Set the database adapter
Model.setAdapter(adapter);

// Define associations (after all models are loaded)
// Webhook.hasMany('requests', () => import('./WebhookRequest.js').then(m => m.default as typeof Model));

export default Webhook;
