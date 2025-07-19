import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import prisma from './prisma-client.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.text({ type: '*/*', limit: '10mb' }));

// Serve static frontend files
app.use(express.static('public'));

// Find or create webhook and store webhook request
const storeWebhookRequest = async (req, webhookPath, relayStatus = null, relayResponse = null) => {
  try {
    // Find or create webhook
    let webhook = await prisma.webhook.findFirst({
      where: {
        path: webhookPath
      }
    });
    
    if (!webhook) {
      // Create new webhook with empty target URL (user can set it later)
      webhook = await prisma.webhook.create({
        data: {
          path: webhookPath,
          targetUrl: '',
          active: true
        }
      });
      console.log(`Created new webhook for path: ${webhookPath}`);
    }
    
    // Store the request linked to the webhook
    const webhookRequest = await prisma.webhookRequest.create({
      data: {
        method: req.method,
        url: req.originalUrl,
        headers: JSON.stringify(req.headers),
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
        queryParams: JSON.stringify(req.query),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
        relayStatus: relayStatus,
        relayResponse: relayResponse,
        webhookId: webhook.id
      }
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
    const webhook = await prisma.webhook.findFirst({
      where: {
        path: webhookPath,
        active: true
      }
    });
    
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
    const webhooks = await prisma.webhook.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: { requests: true }
        }
      }
    });
    
    // Map Prisma fields to camelCase API fields
    const parsedWebhooks = webhooks.map(webhook => ({
      id: webhook.id,
      path: webhook.path,
      targetUrl: webhook.targetUrl,
      active: webhook.active,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt,
      requestCount: webhook._count.requests
    }));
    
    res.json(parsedWebhooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create webhook (new API)
app.post('/api/webhooks', async (req, res) => {
  const { path, targetUrl } = req.body;
  
  if (!path || !targetUrl) {
    return res.status(400).json({ error: 'path and targetUrl are required' });
  }
  
  try {
    const webhook = await prisma.webhook.create({
      data: {
        path: path,
        targetUrl: targetUrl
      }
    });
    
    res.status(201).json({ 
      id: webhook.id, 
      path: webhook.path, 
      targetUrl: webhook.targetUrl,
      active: webhook.active,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Webhook path already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update webhook (new API)
app.put('/api/webhooks/:id', async (req, res) => {
  const { path, targetUrl, active } = req.body;
  
  try {
    const webhook = await prisma.webhook.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        path: path,
        targetUrl: targetUrl,
        active: active
      }
    });
    
    res.json({ 
      id: webhook.id,
      path: webhook.path,
      targetUrl: webhook.targetUrl,
      active: webhook.active,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Webhook path already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete webhook (new API)
app.delete('/api/webhooks/:id', async (req, res) => {
  try {
    await prisma.webhook.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });
    
    res.json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get all webhook requests (optionally filtered by webhook ID)
app.get('/api/requests', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const webhookId = req.query.webhookId ? parseInt(req.query.webhookId) : undefined;
    
    const whereClause = webhookId ? { webhookId: webhookId } : {};
    
    const requests = await prisma.webhookRequest.findMany({
      where: whereClause,
      orderBy: {
        timestamp: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        webhook: {
          select: {
            id: true,
            path: true,
            targetUrl: true,
            active: true
          }
        }
      }
    });
    
    // Parse JSON strings back to objects and map fields
    const parsedRequests = requests.map(row => ({
      id: row.id,
      method: row.method,
      url: row.url,
      headers: JSON.parse(row.headers || '{}'),
      body: row.body,
      queryParams: JSON.parse(row.queryParams || '{}'),
      timestamp: row.timestamp,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent,
      relayStatus: row.relayStatus,
      relayResponse: row.relayResponse,
      webhookId: row.webhookId,
      webhook: row.webhook,
      // Legacy fields for backward compatibility
      query_params: JSON.parse(row.queryParams || '{}'),
      ip_address: row.ipAddress,
      user_agent: row.userAgent
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
    const request = await prisma.webhookRequest.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      include: {
        webhook: {
          select: {
            id: true,
            path: true,
            targetUrl: true,
            active: true
          }
        }
      }
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Parse JSON strings and map fields
    const parsedRequest = {
      id: request.id,
      method: request.method,
      url: request.url,
      headers: JSON.parse(request.headers || '{}'),
      body: request.body,
      queryParams: JSON.parse(request.queryParams || '{}'),
      timestamp: request.timestamp,
      ipAddress: request.ipAddress,
      userAgent: request.userAgent,
      relayStatus: request.relayStatus,
      relayResponse: request.relayResponse,
      webhookId: request.webhookId,
      webhook: request.webhook,
      // Legacy fields for backward compatibility
      query_params: JSON.parse(request.queryParams || '{}'),
      ip_address: request.ipAddress,
      user_agent: request.userAgent
    };
    
    res.json(parsedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all URL mappings
app.get('/api/mappings', async (req, res) => {
  try {
    const mappings = await prisma.urlMapping.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Map Prisma fields to expected API fields
    const parsedMappings = mappings.map(mapping => ({
      ...mapping,
      webhook_path: mapping.webhookPath,
      target_url: mapping.targetUrl,
      created_at: mapping.createdAt,
      updated_at: mapping.updatedAt
    }));
    
    res.json(parsedMappings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create URL mapping
app.post('/api/mappings', async (req, res) => {
  const { webhook_path, target_url } = req.body;
  
  if (!webhook_path || !target_url) {
    return res.status(400).json({ error: 'webhook_path and target_url are required' });
  }
  
  try {
    const mapping = await prisma.urlMapping.create({
      data: {
        webhookPath: webhook_path,
        targetUrl: target_url
      }
    });
    
    res.status(201).json({ 
      id: mapping.id, 
      webhook_path: mapping.webhookPath, 
      target_url: mapping.targetUrl,
      active: mapping.active,
      created_at: mapping.createdAt
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Webhook path already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update URL mapping
app.put('/api/mappings/:id', async (req, res) => {
  const { webhook_path, target_url, active } = req.body;
  
  try {
    const mapping = await prisma.urlMapping.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        webhookPath: webhook_path,
        targetUrl: target_url,
        active: active
      }
    });
    
    res.json({ message: 'Mapping updated successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Mapping not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete URL mapping
app.delete('/api/mappings/:id', async (req, res) => {
  try {
    await prisma.urlMapping.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });
    
    res.json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Mapping not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete webhook request
app.delete('/api/requests/:id', async (req, res) => {
  try {
    await prisma.webhookRequest.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });
    
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Clear all webhook requests
app.delete('/api/requests', async (req, res) => {
  try {
    const result = await prisma.webhookRequest.deleteMany({});
    
    res.json({ message: `Deleted ${result.count} requests` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resend a webhook request
app.post('/api/requests/:id/resend', async (req, res) => {
  try {
    // Get the original request with webhook information
    const request = await prisma.webhookRequest.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      include: {
        webhook: true
      }
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (!request.webhook) {
      return res.status(400).json({ error: 'No webhook found for this request' });
    }

    if (!request.webhook.active) {
      return res.status(400).json({ error: 'Webhook is not active' });
    }

    if (!request.webhook.targetUrl) {
      return res.status(400).json({ error: 'No target URL configured for this webhook' });
    }

    // Recreate the request object for forwarding
    const mockReq = {
      method: request.method,
      originalUrl: request.url,
      headers: JSON.parse(request.headers || '{}'),
      body: request.body ? (request.body.startsWith('{') ? JSON.parse(request.body) : request.body) : {},
      query: JSON.parse(request.queryParams || '{}'),
      ip: request.ipAddress,
      get: (header) => JSON.parse(request.headers || '{}')[header.toLowerCase()]
    };

    // Forward the webhook
    const result = await forwardWebhook(mockReq, request.webhook.targetUrl);
    
    // Update the original request with new relay information
    await prisma.webhookRequest.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        relayStatus: result.relayStatus,
        relayResponse: result.relayResponse
      }
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

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});