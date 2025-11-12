import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { Webhook, WebhookRequest } from './src/models/index.js';

const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.text({ type: '*/*', limit: '10mb' }));

  // Find or create webhook and store webhook request
  const storeWebhookRequest = async (req, webhookPath, relayStatus = null, relayResponse = null) => {
  try {
    // Find or create webhook
    let webhook = await Webhook.findBy({ path: webhookPath });
    
    if (!webhook) {
      // Create new webhook with empty target URL (user can set it later)
      webhook = await Webhook.create({
        path: webhookPath,
        target_url: '',
        active: true
      });
      console.log(`Created new webhook for path: ${webhookPath}`);
    }
    
    // Store the request linked to the webhook
    const webhookRequest = await WebhookRequest.create({
      method: req.method,
      url: req.originalUrl,
      headers: JSON.stringify(req.headers),
      body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
      query_params: JSON.stringify(req.query),
      ip_address: req.ip,
      user_agent: req.get('User-Agent') || '',
      relay_status: relayStatus,
      relay_response: relayResponse,
      webhook_id: webhook.id
    });
    
    return { webhook, webhookRequest };
  } catch (error) {
    console.error('Failed to store webhook request:', error);
    throw error;
  }
};

  // Forward webhook to target URL
  const forwardWebhook = async (req, targetUrl) => {
  console.log(`Forwarding ${req.method} to ${targetUrl}`);
  try {
    // Clean headers to avoid forwarding issues
    const cleanHeaders = { ...req.headers };
    delete cleanHeaders.host;
    delete cleanHeaders.connection;
    delete cleanHeaders['content-length'];
    
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: cleanHeaders,
      data: req.body,
      params: req.query,
      timeout: 10000, // Reduced timeout
      validateStatus: () => true, // Accept all status codes
    });
    
    console.log(`Forward response: ${response.status}`);
    return { 
      success: true, 
      status: response.status, 
      data: response.data,
      relayStatus: `${response.status}`,
      relayResponse: JSON.stringify({ status: response.status, data: response.data })
    };
  } catch (error) {
    console.error(`Forward error:`, error.message);
    return { 
      success: false, 
      status: error.response?.status || 500, 
      error: error.message,
      relayStatus: 'error',
      relayResponse: JSON.stringify({ error: error.message, status: error.response?.status || 500 })
    };
  }
};

  // Webhook endpoint handler
  app.all('/webhook/*', async (req, res) => {
  const webhookPath = req.params[0] || '';
  console.log(`Received ${req.method} request for webhook path: ${webhookPath}`);
  
  let relayStatus = null;
  let relayResponse = null;
  
  try {
    // Check if there's a webhook with a target URL for this path
    console.log('Checking for webhook...');
    const webhook = await Webhook.where({ path: webhookPath, active: true }).first();
    
    if (webhook && webhook.targetUrl) {
      console.log(`Found webhook with target URL: ${webhook.targetUrl}`);
      // Forward the webhook
      const result = await forwardWebhook(req, webhook.targetUrl);
      console.log('Forward result:', result);
      
      relayStatus = result.relayStatus;
      relayResponse = result.relayResponse;
      
      // Store the request with relay information
      await storeWebhookRequest(req, webhookPath, relayStatus, relayResponse);
      console.log('Request stored in database with relay info');
      
      // Always return 200 regardless of forwarding result
      if (result.success) {
        console.log('Forwarding succeeded, sending acknowledgment');
        res.status(200).json({ 
          message: 'Webhook received and forwarded', 
          timestamp: new Date().toISOString(),
          forwarded: true,
          forward_status: result.status
        });
      } else {
        console.log('Forwarding failed, but still sending acknowledgment');
        res.status(200).json({ 
          message: 'Webhook received but forwarding failed', 
          timestamp: new Date().toISOString(),
          forwarded: false,
          forward_error: result.error
        });
      }
    } else {
      console.log('No webhook with target URL found, creating/updating webhook and storing request');
      // Store the request (this will create webhook if it doesn't exist)
      await storeWebhookRequest(req, webhookPath, relayStatus, relayResponse);
      console.log('Request stored in database');
      
      // No target URL configured, just acknowledge receipt
      res.status(200).json({ 
        message: 'Webhook received', 
        timestamp: new Date().toISOString(),
        note: webhook ? 'No target URL configured for this webhook' : 'New webhook created - configure target URL to enable forwarding'
      });
    }
  } catch (err) {
    console.error('Database error:', err);
    // Try to store the request anyway, but without relay info
    try {
      await storeWebhookRequest(req, webhookPath, 'error', JSON.stringify({ error: 'Database error during processing' }));
    } catch (storeError) {
      console.error('Failed to store request after database error:', storeError);
    }
    
    // Still return 200 to acknowledge webhook receipt
    res.status(200).json({ 
      message: 'Webhook received but database error occurred', 
      timestamp: new Date().toISOString(),
      error: 'Database error'
    });
  }
});

  // API Routes

  // Get all webhooks (new API)
  app.get('/api/webhooks', async (req, res) => {
  try {
    const webhooks = await Webhook.orderBy('created_at', 'DESC').all();

    // Count requests for each webhook
    const parsedWebhooks = await Promise.all(webhooks.map(async webhook => {
      const requestCount = await WebhookRequest.where({ webhook_id: webhook.id }).count();
      return {
        id: webhook.id,
        path: webhook.path,
        targetUrl: webhook.targetUrl,
        previewField: webhook.previewField,
        active: webhook.active,
        createdAt: webhook.createdAt,
        updatedAt: webhook.updatedAt,
        requestCount: requestCount
      };
    }));
    
    res.json(parsedWebhooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  // Create webhook (new API)
  app.post('/api/webhooks', async (req, res) => {
  const { path, targetUrl, previewField } = req.body;
  
  if (!path) {
    return res.status(400).json({ error: 'path is required' });
  }
  
  try {
    const webhook = await Webhook.create({
      path: path,
      target_url: targetUrl || null,
      preview_field: previewField || null
    });
    
    res.status(201).json({ 
      id: webhook.id, 
      path: webhook.path, 
      targetUrl: webhook.targetUrl,
      previewField: webhook.previewField,
      active: webhook.active,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt
    });
  } catch (error) {
    // Check for unique constraint violation
    if (error.message && error.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'Webhook path already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

  // Update webhook (new API)
  app.put('/api/webhooks/:id', async (req, res) => {
  const { path, targetUrl, active, previewField } = req.body;
  
  try {
    const webhook = await Webhook.find(parseInt(req.params.id));
    
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    
    await webhook.update({
      path: path,
      target_url: targetUrl,
      active: active,
      preview_field: previewField
    });
    
    res.json({ 
      id: webhook.id,
      path: webhook.path,
      targetUrl: webhook.targetUrl,
      previewField: webhook.previewField,
      active: webhook.active,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt
    });
  } catch (error) {
    if (error.message && error.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'Webhook path already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

  // Delete webhook (new API)
  app.delete('/api/webhooks/:id', async (req, res) => {
  try {
    const webhook = await Webhook.find(parseInt(req.params.id));
    
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    
    await webhook.destroy();
    
    res.json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  // Get all webhook requests (optionally filtered by webhook ID)
  app.get('/api/requests', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const webhookId = req.query.webhookId ? parseInt(req.query.webhookId) : undefined;
    
    let query = WebhookRequest.orderBy('timestamp', 'DESC').limit(limit).offset(offset);
    
    if (webhookId) {
      query = query.where({ webhook_id: webhookId });
    }
    
    const requests = await query.all();
    
    // Load webhook data for each request
    const parsedRequests = await Promise.all(requests.map(async row => {
      const webhook = await Webhook.find(row.webhook_id);
      return {
        id: row.id,
        method: row.method,
        url: row.url,
        headers: JSON.parse(row.headers || '{}'),
        body: row.body,
        queryParams: JSON.parse(row.query_params || '{}'),
        timestamp: row.timestamp,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        relayStatus: row.relay_status,
        relayResponse: row.relay_response,
        webhookId: row.webhook_id,
        webhook: webhook ? {
          id: webhook.id,
          path: webhook.path,
          targetUrl: webhook.targetUrl,
          active: webhook.active
        } : null,
        // Legacy fields for backward compatibility
        query_params: JSON.parse(row.query_params || '{}'),
        ip_address: row.ip_address,
        user_agent: row.user_agent
      };
    }));
    
    res.json(parsedRequests);
  } catch (error) {
    console.error({ error: error.message })
    res.status(500).json({ error: error.message });
  }
});

  // Get single webhook request
  app.get('/api/requests/:id', async (req, res) => {
  try {
    const request = await WebhookRequest.find(parseInt(req.params.id));
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    const webhook = await Webhook.find(request.webhook_id);
    
    // Parse JSON strings and map fields
    const parsedRequest = {
      id: request.id,
      method: request.method,
      url: request.url,
      headers: JSON.parse(request.headers || '{}'),
      body: request.body,
      queryParams: JSON.parse(request.query_params || '{}'),
      timestamp: request.timestamp,
      ipAddress: request.ip_address,
      userAgent: request.user_agent,
      relayStatus: request.relay_status,
      relayResponse: request.relay_response,
      webhookId: request.webhook_id,
      webhook: webhook ? {
        id: webhook.id,
        path: webhook.path,
        targetUrl: webhook.targetUrl,
        active: webhook.active
      } : null,
      // Legacy fields for backward compatibility
      query_params: JSON.parse(request.query_params || '{}'),
      ip_address: request.ip_address,
      user_agent: request.user_agent
    };
    
    res.json(parsedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  // Legacy URL mappings endpoints (return error as urlMapping table no longer exists)
  app.get('/api/mappings', async (req, res) => {
    res.status(410).json({ error: 'URL mappings have been replaced by webhooks API' });
  });

  app.post('/api/mappings', async (req, res) => {
    res.status(410).json({ error: 'URL mappings have been replaced by webhooks API. Use /api/webhooks instead' });
  });

  app.put('/api/mappings/:id', async (req, res) => {
    res.status(410).json({ error: 'URL mappings have been replaced by webhooks API. Use /api/webhooks instead' });
  });

  app.delete('/api/mappings/:id', async (req, res) => {
    res.status(410).json({ error: 'URL mappings have been replaced by webhooks API. Use /api/webhooks instead' });
  });

  // Delete webhook request
  app.delete('/api/requests/:id', async (req, res) => {
  try {
    const request = await WebhookRequest.find(parseInt(req.params.id));
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    await request.destroy();
    
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  // Clear all webhook requests
  app.delete('/api/requests', async (req, res) => {
  try {
    const requests = await WebhookRequest.all();
    let count = 0;
    
    for (const request of requests) {
      await request.destroy();
      count++;
    }
    
    res.json({ message: `Deleted ${count} requests` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  // Resend a webhook request
  app.post('/api/requests/:id/resend', async (req, res) => {
  try {
    // Get the original request with webhook information
    const request = await WebhookRequest.find(parseInt(req.params.id));

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const webhook = await Webhook.find(request.webhook_id);
    
    if (!webhook) {
      return res.status(400).json({ error: 'No webhook found for this request' });
    }

    if (!webhook.active) {
      return res.status(400).json({ error: 'Webhook is not active' });
    }

    if (!webhook.targetUrl) {
      return res.status(400).json({ error: 'No target URL configured for this webhook' });
    }

    // Recreate the request object for forwarding
    const mockReq = {
      method: request.method,
      originalUrl: request.url,
      headers: JSON.parse(request.headers || '{}'),
      body: request.body ? (request.body.startsWith('{') ? JSON.parse(request.body) : request.body) : {},
      query: JSON.parse(request.query_params || '{}'),
      ip: request.ip_address,
      get: (header) => JSON.parse(request.headers || '{}')[header.toLowerCase()]
    };

    // Forward the webhook
    const result = await forwardWebhook(mockReq, webhook.targetUrl);
    
    // Update the original request with new relay information
    await request.update({
      relay_status: result.relayStatus,
      relay_response: result.relayResponse
    });
    
    res.json({
      message: 'Request resent',
      success: result.success,
      status: result.status,
      error: result.error || null
    });

  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: 'Failed to resend request' });
  }
});

  // Setup Vite middleware for development (after all API routes)
  if (isDevelopment) {
    const { createServer } = await import('vite');
    
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    
    app.use(vite.middlewares);
  } else {
    // In production, serve static frontend files
    app.use(express.static('public'));
  }

  // Catch-all handler: send back React's index.html file for any non-API routes
  if (!isDevelopment) {
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'public' });
    });
  }

  app.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
  });
}

// Start the server
startServer().catch(console.error);
