import express from 'express';
import { Webhook, WebhookRequest } from './src/models/index.js';
import { targetUrlError } from './src/lib/target-url.js';

const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';
const RELAY_RESPONSE_LIMIT = 100_000;
const HOP_BY_HOP = new Set([
  'host',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'content-length',
]);

function requestPath(req) {
  return (req.originalUrl || req.path || '').split('?')[0];
}

function parseId(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

function boundedInt(value, fallback, min, max) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(String(raw ?? ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

function parseJson(value, fallback) {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function isUniqueViolation(error) {
  return error?.code === '23505' || /duplicate key/i.test(error?.message || '');
}

function publicError(res, status, message) {
  return res.status(status).json({ error: message });
}

function loadAll(model, rows) {
  return rows.map((row) => model.instantiate(row));
}

function serializeWebhook(webhook, requestCount = 0) {
  return {
    id: webhook.id,
    path: webhook.path,
    targetUrl: webhook.targetUrl,
    previewField: webhook.previewField,
    active: webhook.active,
    createdAt: webhook.createdAt,
    updatedAt: webhook.updatedAt,
    requestCount,
  };
}

function serializeRequest(request, webhook) {
  return {
    id: request.id,
    method: request.method,
    url: request.url,
    headers: parseJson(request.headers, {}),
    body: request.body,
    queryParams: parseJson(request.queryParams, {}),
    timestamp: request.timestamp,
    ipAddress: request.ipAddress,
    userAgent: request.userAgent,
    relayStatus: request.relayStatus,
    relayResponse: request.relayResponse,
    webhookId: request.webhookId,
    webhook: webhook
      ? {
          id: webhook.id,
          path: webhook.path,
          targetUrl: webhook.targetUrl,
          active: webhook.active,
        }
      : null,
  };
}

function rawBodyOf(req) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  if (req.body == null) return Buffer.alloc(0);
  return Buffer.from(JSON.stringify(req.body));
}

function headerMap(headers) {
  const cleaned = {};
  for (const [key, value] of Object.entries(headers || {})) {
    if (HOP_BY_HOP.has(key.toLowerCase()) || value == null) continue;
    cleaned[key] = Array.isArray(value) ? value.join(', ') : String(value);
  }
  return cleaned;
}

function forwardUrl(targetUrl, query) {
  const url = new URL(targetUrl);
  for (const [key, value] of Object.entries(query || {})) {
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, String(item));
    } else if (value != null) {
      url.searchParams.append(key, String(value));
    }
  }
  return url.toString();
}

function clip(text) {
  if (text.length <= RELAY_RESPONSE_LIMIT) return text;
  return text.slice(0, RELAY_RESPONSE_LIMIT);
}

async function sql(statement, params = []) {
  const adapter = Webhook.getAdapter();
  const prepared = adapter.convertPlaceholders(statement, params);
  return adapter.query(prepared.sql, prepared.params);
}

async function execute(statement, params = []) {
  const adapter = Webhook.getAdapter();
  const prepared = adapter.convertPlaceholders(statement, params);
  return adapter.execute(prepared.sql, prepared.params);
}

async function forwardWebhook(req, targetUrl) {
  const blocked = targetUrlError(targetUrl);
  if (blocked) {
    return {
      success: false,
      status: 400,
      relayStatus: 'error',
      relayResponse: JSON.stringify({ error: blocked }),
    };
  }

  const method = String(req.method || 'POST').toUpperCase();
  const body = rawBodyOf(req);
  const sendBody = method !== 'GET' && method !== 'HEAD';

  try {
    const response = await fetch(forwardUrl(targetUrl, req.query), {
      method,
      headers: headerMap(req.headers),
      body: sendBody ? body : undefined,
      redirect: 'manual',
      signal: AbortSignal.timeout(10000),
    });
    const text = clip(await response.text());
    return {
      success: true,
      status: response.status,
      relayStatus: String(response.status),
      relayResponse: JSON.stringify({ status: response.status, data: text }),
    };
  } catch (error) {
    const message = error?.name === 'TimeoutError' ? 'Forward timed out' : 'Forward failed';
    return {
      success: false,
      status: 500,
      relayStatus: 'error',
      relayResponse: JSON.stringify({ error: message }),
    };
  }
}

async function storeWebhookRequest(req, webhook, relayStatus, relayResponse) {
  const body = rawBodyOf(req).toString('utf8');
  return WebhookRequest.create({
    method: req.method,
    url: req.originalUrl,
    headers: JSON.stringify(req.headers || {}),
    body,
    queryParams: JSON.stringify(req.query || {}),
    timestamp: new Date(),
    ipAddress: req.ip,
    userAgent: req.get('user-agent') || '',
    relayStatus,
    relayResponse,
    webhookId: webhook.id,
  });
}

function nullableText(value) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed ? trimmed : null;
}

function webhookChanges(body) {
  const changes = {};
  if (body.path !== undefined) {
    const path = String(body.path).trim();
    if (!path) return { error: 'path is required' };
    if (path.length > 200) return { error: 'path is too long' };
    changes.path = path;
  }
  if (body.targetUrl !== undefined) {
    const targetUrl = nullableText(body.targetUrl);
    const blocked = targetUrlError(targetUrl);
    if (blocked) return { error: blocked };
    changes.targetUrl = targetUrl;
  }
  if (body.previewField !== undefined) {
    changes.previewField = nullableText(body.previewField);
  }
  if (body.active !== undefined) {
    if (typeof body.active !== 'boolean') return { error: 'active must be a boolean' };
    changes.active = body.active;
  }
  return { changes };
}

async function requestCounts() {
  const result = await sql(
    'SELECT webhook_id, COUNT(*)::int AS count FROM webhook_requests GROUP BY webhook_id'
  );
  return new Map(result.rows.map((row) => [Number(row.webhook_id), Number(row.count)]));
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.get('/up', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use('/api', express.json({ limit: '1mb' }));

  app.use('/webhook', express.raw({ type: () => true, limit: '10mb' }), async (req, res) => {
    // Mounted at /webhook, so req.path is the remainder (/github, not /webhook/github).
    const webhookPath = req.path.replace(/^\/+|\/+$/g, '');
    if (!webhookPath || webhookPath.length > 200) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    try {
      const webhook = await Webhook.findBy({ path: webhookPath });
      if (!webhook) {
        return res.status(404).json({ error: 'Webhook not found' });
      }
      let relayStatus = null;
      let relayResponse = null;
      let forwarded = false;
      let forwardStatus = null;

      if (webhook.active && webhook.targetUrl) {
        const result = await forwardWebhook(req, webhook.targetUrl);
        relayStatus = result.relayStatus;
        relayResponse = result.relayResponse;
        forwarded = result.success;
        forwardStatus = result.status;
      }

      await storeWebhookRequest(req, webhook, relayStatus, relayResponse);

      if (webhook.active && webhook.targetUrl) {
        return res.status(200).json({
          message: forwarded ? 'Webhook received and forwarded' : 'Webhook received but forwarding failed',
          timestamp: new Date().toISOString(),
          forwarded,
          ...(forwarded ? { forward_status: forwardStatus } : {}),
        });
      }

      const note = webhook.active
        ? 'No target URL configured for this webhook'
        : 'Webhook is inactive';
      return res.status(200).json({
        message: 'Webhook received',
        timestamp: new Date().toISOString(),
        note,
      });
    } catch (error) {
      console.error('Failed to process webhook:', error);
      return res.status(200).json({
        message: 'Webhook received but could not be stored',
        timestamp: new Date().toISOString(),
      });
    }
  });

  app.get('/api/webhooks', async (_req, res) => {
    try {
      const rows = await Webhook.orderBy('created_at', 'DESC').all();
      const webhooks = loadAll(Webhook, rows);
      const counts = await requestCounts();
      res.json(webhooks.map((webhook) => serializeWebhook(webhook, counts.get(webhook.id) || 0)));
    } catch (error) {
      console.error('Failed to list webhooks:', error);
      publicError(res, 500, 'Failed to list webhooks');
    }
  });

  app.get('/api/webhooks/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return publicError(res, 400, 'Invalid webhook id');

    try {
      const webhook = await Webhook.find(id);
      if (!webhook) return publicError(res, 404, 'Webhook not found');
      const countResult = await sql(
        'SELECT COUNT(*)::int AS count FROM webhook_requests WHERE webhook_id = ?',
        [id]
      );
      const requestCount = Number(countResult.rows[0]?.count || 0);
      res.json(serializeWebhook(webhook, requestCount));
    } catch (error) {
      console.error('Failed to load webhook:', error);
      publicError(res, 500, 'Failed to load webhook');
    }
  });

  app.post('/api/webhooks', async (req, res) => {
    const path = nullableText(req.body?.path);
    if (!path) return publicError(res, 400, 'path is required');
    if (path.length > 200) return publicError(res, 400, 'path is too long');

    const targetUrl = nullableText(req.body?.targetUrl);
    const blocked = targetUrlError(targetUrl);
    if (blocked) return publicError(res, 400, blocked);

    try {
      const webhook = await Webhook.create({
        path,
        targetUrl,
        previewField: nullableText(req.body?.previewField),
        active: true,
      });
      res.status(201).json(serializeWebhook(webhook, 0));
    } catch (error) {
      if (isUniqueViolation(error)) return publicError(res, 409, 'Webhook path already exists');
      console.error('Failed to create webhook:', error);
      publicError(res, 500, 'Failed to create webhook');
    }
  });

  app.put('/api/webhooks/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return publicError(res, 400, 'Invalid webhook id');

    const { error, changes } = webhookChanges(req.body || {});
    if (error) return publicError(res, 400, error);
    if (Object.keys(changes).length === 0) return publicError(res, 400, 'No changes provided');

    try {
      const webhook = await Webhook.find(id);
      if (!webhook) return publicError(res, 404, 'Webhook not found');
      await webhook.update(changes);
      const countResult = await sql(
        'SELECT COUNT(*)::int AS count FROM webhook_requests WHERE webhook_id = ?',
        [id]
      );
      res.json(serializeWebhook(webhook, Number(countResult.rows[0]?.count || 0)));
    } catch (updateError) {
      if (isUniqueViolation(updateError)) return publicError(res, 409, 'Webhook path already exists');
      console.error('Failed to update webhook:', updateError);
      publicError(res, 500, 'Failed to update webhook');
    }
  });

  app.delete('/api/webhooks/:id/requests', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return publicError(res, 400, 'Invalid webhook id');

    try {
      const webhook = await Webhook.find(id);
      if (!webhook) return publicError(res, 404, 'Webhook not found');
      const result = await execute('DELETE FROM webhook_requests WHERE webhook_id = ?', [id]);
      res.json({ message: `Deleted ${result.rowCount || 0} requests` });
    } catch (error) {
      console.error('Failed to clear webhook requests:', error);
      publicError(res, 500, 'Failed to clear requests');
    }
  });

  app.delete('/api/webhooks/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return publicError(res, 400, 'Invalid webhook id');

    try {
      const webhook = await Webhook.find(id);
      if (!webhook) return publicError(res, 404, 'Webhook not found');
      await execute('DELETE FROM webhook_requests WHERE webhook_id = ?', [id]);
      await webhook.destroy();
      res.json({ message: 'Webhook deleted successfully' });
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      publicError(res, 500, 'Failed to delete webhook');
    }
  });

  app.get('/api/requests', async (req, res) => {
    try {
      const limit = boundedInt(req.query.limit, 100, 1, 500);
      const offset = boundedInt(req.query.offset, 0, 0, 1_000_000);
      let webhookId;
      if (req.query.webhookId !== undefined && req.query.webhookId !== '') {
        webhookId = parseId(req.query.webhookId);
        if (!webhookId) return publicError(res, 400, 'Invalid webhookId');
      }

      let query = WebhookRequest.orderBy('timestamp', 'DESC').limit(limit).offset(offset);
      if (webhookId) query = query.where({ webhook_id: webhookId });
      const requests = loadAll(WebhookRequest, await query.all());

      const webhooks = new Map();
      for (const webhookIdValue of new Set(requests.map((request) => request.webhookId))) {
        const webhook = await Webhook.find(webhookIdValue);
        if (webhook) webhooks.set(webhookIdValue, webhook);
      }

      res.json(requests.map((request) => serializeRequest(request, webhooks.get(request.webhookId) || null)));
    } catch (error) {
      console.error('Failed to list requests:', error);
      publicError(res, 500, 'Failed to list requests');
    }
  });

  app.get('/api/requests/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return publicError(res, 400, 'Invalid request id');

    try {
      const request = await WebhookRequest.find(id);
      if (!request) return publicError(res, 404, 'Request not found');
      const webhook = await Webhook.find(request.webhookId);
      res.json(serializeRequest(request, webhook));
    } catch (error) {
      console.error('Failed to load request:', error);
      publicError(res, 500, 'Failed to load request');
    }
  });

  app.delete('/api/requests/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return publicError(res, 400, 'Invalid request id');

    try {
      const request = await WebhookRequest.find(id);
      if (!request) return publicError(res, 404, 'Request not found');
      await request.destroy();
      res.json({ message: 'Request deleted successfully' });
    } catch (error) {
      console.error('Failed to delete request:', error);
      publicError(res, 500, 'Failed to delete request');
    }
  });

  app.delete('/api/requests', async (_req, res) => {
    try {
      const result = await execute('DELETE FROM webhook_requests');
      res.json({ message: `Deleted ${result.rowCount || 0} requests` });
    } catch (error) {
      console.error('Failed to clear requests:', error);
      publicError(res, 500, 'Failed to clear requests');
    }
  });

  app.post('/api/requests/:id/resend', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return publicError(res, 400, 'Invalid request id');

    try {
      const request = await WebhookRequest.find(id);
      if (!request) return publicError(res, 404, 'Request not found');

      const webhook = await Webhook.find(request.webhookId);
      if (!webhook) return publicError(res, 400, 'No webhook found for this request');
      if (!webhook.active) return publicError(res, 400, 'Webhook is not active');
      if (!webhook.targetUrl) return publicError(res, 400, 'No target URL configured for this webhook');

      const headers = parseJson(request.headers, {});
      const query = parseJson(request.queryParams, {});
      const mockReq = {
        method: request.method,
        headers,
        query,
        rawBody: Buffer.from(request.body || '', 'utf8'),
        get: (name) => headers[String(name).toLowerCase()],
      };
      const result = await forwardWebhook(mockReq, webhook.targetUrl);

      await WebhookRequest.create({
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        queryParams: request.queryParams,
        timestamp: new Date(),
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        relayStatus: result.relayStatus,
        relayResponse: result.relayResponse,
        webhookId: request.webhookId,
      });

      res.json({
        message: 'Request resent',
        success: result.success,
        status: result.status,
      });
    } catch (error) {
      console.error('Failed to resend request:', error);
      publicError(res, 500, 'Failed to resend request');
    }
  });

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    console.error('Request error:', error);
    const path = requestPath(req);
    if (path === '/webhook' || path.startsWith('/webhook/')) {
      return res.status(200).json({
        message: 'Webhook received but could not be processed',
        timestamp: new Date().toISOString(),
      });
    }
    const status = error?.type === 'entity.parse.failed' ? 400 : 500;
    return publicError(res, status, status === 400 ? 'Invalid JSON body' : 'Internal server error');
  });

  if (isDevelopment) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('public'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'public' });
    });
  }

  app.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
