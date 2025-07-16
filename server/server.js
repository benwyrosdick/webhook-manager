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

// Store webhook request
const storeWebhookRequest = async (req) => {
  try {
    await prisma.webhookRequest.create({
      data: {
        method: req.method,
        url: req.originalUrl,
        headers: JSON.stringify(req.headers),
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
        queryParams: JSON.stringify(req.query),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      }
    });
  } catch (error) {
    console.error('Failed to store webhook request:', error);
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
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    console.error(`Forward error:`, error.message);
    return { 
      success: false, 
      status: error.response?.status || 500, 
      error: error.message 
    };
  }
};

// Webhook endpoint handler
app.all('/webhook/*', async (req, res) => {
  const webhookPath = req.params[0] || '';
  console.log(`Received ${req.method} request for webhook path: ${webhookPath}`);
  
  // Store the request
  await storeWebhookRequest(req);
  console.log('Request stored in database');
  
  try {
    // Check if there's a mapping for this webhook path
    console.log('Checking for URL mapping...');
    const mapping = await prisma.urlMapping.findFirst({
      where: {
        webhookPath: webhookPath,
        active: true
      },
      select: {
        targetUrl: true
      }
    });
    
    if (mapping) {
      console.log(`Found mapping, target URL: ${mapping.targetUrl}`);
      // Forward the webhook
      const result = await forwardWebhook(req, mapping.targetUrl);
      console.log('Forward result:', result);
      
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
      console.log('No mapping found, sending acknowledgment');
      // No mapping found, just acknowledge receipt
      res.status(200).json({ message: 'Webhook received', timestamp: new Date().toISOString() });
    }
  } catch (err) {
    console.error('Database error:', err);
    // Still return 200 to acknowledge webhook receipt
    res.status(200).json({ 
      message: 'Webhook received but database error occurred', 
      timestamp: new Date().toISOString(),
      error: 'Database error'
    });
  }
});

// API Routes

// Get all webhook requests
app.get('/api/requests', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const requests = await prisma.webhookRequest.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: limit,
      skip: offset
    });
    
    // Parse JSON strings back to objects
    const parsedRequests = requests.map(row => ({
      ...row,
      headers: JSON.parse(row.headers || '{}'),
      query_params: JSON.parse(row.queryParams || '{}'),
      // Map Prisma fields to expected API fields
      ip_address: row.ipAddress,
      user_agent: row.userAgent,
      query_params: JSON.parse(row.queryParams || '{}')
    }));
    
    res.json(parsedRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single webhook request
app.get('/api/requests/:id', async (req, res) => {
  try {
    const request = await prisma.webhookRequest.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Parse JSON strings and map fields
    const parsedRequest = {
      ...request,
      headers: JSON.parse(request.headers || '{}'),
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
    // Get the original request
    const request = await prisma.webhookRequest.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Extract webhook path from URL
    const urlParts = request.url.split('/webhook/');
    const webhookPath = urlParts[1] || '';

    // Check if there's a mapping for this webhook path
    const mapping = await prisma.urlMapping.findFirst({
      where: {
        webhookPath: webhookPath,
        active: true
      },
      select: {
        targetUrl: true
      }
    });

    if (!mapping) {
      return res.status(400).json({ error: 'No active mapping found for this webhook path' });
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
    const result = await forwardWebhook(mockReq, mapping.targetUrl);
    
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

app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});