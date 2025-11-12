import Webhook from './Webhook.js';
import WebhookRequest from './WebhookRequest.js';

// Set up associations after both models are loaded
// Uncomment when js-record association types are properly configured
// Webhook.hasMany('requests', () => WebhookRequest);
// WebhookRequest.belongsTo('webhook', () => Webhook);

export { Webhook, WebhookRequest };
