import { Model } from 'js-record';
import adapter from '../db/connection.js';

class Webhook extends Model {
  static config = {
    tableName: 'webhooks',
    primaryKey: 'id',
    timestamps: true,
    mapAttributes: true,
  };

  id!: number;
  path!: string;
  targetUrl!: string | null;
  previewField!: string | null;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

Model.setAdapter(adapter);

export default Webhook;
