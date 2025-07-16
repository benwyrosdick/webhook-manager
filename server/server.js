import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.text({ type: '*/*', limit: '10mb' }));

// Store webhook request
const storeWebhookRequest = (req) => {
  const stmt = db.prepare(`
    INSERT INTO webhook_requests (method, url, headers, body, query_params, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    req.method,
    req.originalUrl,
    JSON.stringify(req.headers),
    typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
    JSON.stringify(req.query),
    req.ip,
    req.get('User-Agent') || ''
  );
  
  stmt.finalize();
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
  storeWebhookRequest(req);
  console.log('Request stored in database');
  
  try {
    // Check if there's a mapping for this webhook path
    console.log('Checking for URL mapping...');
    const row = await new Promise((resolve, reject) => {
      db.get(
        'SELECT target_url FROM url_mappings WHERE webhook_path = ? AND active = 1',
        [webhookPath],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    if (row) {
      console.log(`Found mapping, target URL: ${row.target_url}`);
      // Forward the webhook
      const result = await forwardWebhook(req, row.target_url);
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
app.get('/api/requests', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;
  
  db.all(
    'SELECT * FROM webhook_requests ORDER BY timestamp DESC LIMIT ? OFFSET ?',
    [limit, offset],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Parse JSON strings back to objects
      const requests = rows.map(row => ({
        ...row,
        headers: JSON.parse(row.headers),
        query_params: JSON.parse(row.query_params),
      }));
      
      res.json(requests);
    }
  );
});

// Get single webhook request
app.get('/api/requests/:id', (req, res) => {
  db.get(
    'SELECT * FROM webhook_requests WHERE id = ?',
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Request not found' });
      }
      
      const request = {
        ...row,
        headers: JSON.parse(row.headers),
        query_params: JSON.parse(row.query_params),
      };
      
      res.json(request);
    }
  );
});

// Get all URL mappings
app.get('/api/mappings', (req, res) => {
  db.all('SELECT * FROM url_mappings ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create URL mapping
app.post('/api/mappings', (req, res) => {
  const { webhook_path, target_url } = req.body;
  
  if (!webhook_path || !target_url) {
    return res.status(400).json({ error: 'webhook_path and target_url are required' });
  }
  
  const stmt = db.prepare(`
    INSERT INTO url_mappings (webhook_path, target_url)
    VALUES (?, ?)
  `);
  
  stmt.run(webhook_path, target_url, function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Webhook path already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    
    res.status(201).json({ 
      id: this.lastID, 
      webhook_path, 
      target_url,
      active: true,
      created_at: new Date().toISOString()
    });
  });
  
  stmt.finalize();
});

// Update URL mapping
app.put('/api/mappings/:id', (req, res) => {
  const { webhook_path, target_url, active } = req.body;
  
  db.run(
    'UPDATE url_mappings SET webhook_path = ?, target_url = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [webhook_path, target_url, active, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Mapping not found' });
      }
      
      res.json({ message: 'Mapping updated successfully' });
    }
  );
});

// Delete URL mapping
app.delete('/api/mappings/:id', (req, res) => {
  db.run('DELETE FROM url_mappings WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Mapping not found' });
    }
    
    res.json({ message: 'Mapping deleted successfully' });
  });
});

// Delete webhook request
app.delete('/api/requests/:id', (req, res) => {
  db.run('DELETE FROM webhook_requests WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({ message: 'Request deleted successfully' });
  });
});

// Clear all webhook requests
app.delete('/api/requests', (req, res) => {
  db.run('DELETE FROM webhook_requests', function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ message: `Deleted ${this.changes} requests` });
  });
});

// Resend a webhook request
app.post('/api/requests/:id/resend', async (req, res) => {
  try {
    // Get the original request
    const request = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM webhook_requests WHERE id = ?',
        [req.params.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Extract webhook path from URL
    const urlParts = request.url.split('/webhook/');
    const webhookPath = urlParts[1] || '';

    // Check if there's a mapping for this webhook path
    const mapping = await new Promise((resolve, reject) => {
      db.get(
        'SELECT target_url FROM url_mappings WHERE webhook_path = ? AND active = 1',
        [webhookPath],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!mapping) {
      return res.status(400).json({ error: 'No active mapping found for this webhook path' });
    }

    // Recreate the request object for forwarding
    const mockReq = {
      method: request.method,
      originalUrl: request.url,
      headers: JSON.parse(request.headers),
      body: request.body ? (request.body.startsWith('{') ? JSON.parse(request.body) : request.body) : {},
      query: JSON.parse(request.query_params),
      ip: request.ip_address,
      get: (header) => JSON.parse(request.headers)[header.toLowerCase()]
    };

    // Forward the webhook
    const result = await forwardWebhook(mockReq, mapping.target_url);
    
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