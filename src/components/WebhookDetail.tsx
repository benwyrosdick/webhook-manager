import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Webhook, WebhookRequest } from '../types/webhook';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Modal } from './ui/modal';
import { ArrowLeft, ExternalLink, Eye, RotateCcw, Trash2, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { CodeHighlighter } from './SyntaxHighlighter';

export default function WebhookDetail() {
  const { id } = useParams<{ id: string }>();
  const webhookId = id ? parseInt(id) : null;
  
  const [webhook, setWebhook] = useState<Webhook | null>(null);
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const fetchWebhook = async () => {
    if (!webhookId) return;
    
    try {
      const webhooks = await api.getWebhooks();
      const foundWebhook = webhooks.find(w => w.id === webhookId);
      setWebhook(foundWebhook || null);
    } catch (error) {
      console.error('Failed to fetch webhook:', error);
    }
  };

  const fetchRequests = async () => {
    if (!webhookId) return;
    
    try {
      setRequestsLoading(true);
      const data = await api.getRequests(100, 0, webhookId);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchWebhook(), fetchRequests()]);
      setLoading(false);
    };
    
    fetchData();
  }, [webhookId]);

  const handleViewRequest = async (requestId: number) => {
    console.log('handleViewRequest called with requestId:', requestId);
    try {
      console.log('Fetching request details...');
      const request = await api.getRequest(requestId);
      console.log('Request details fetched:', request);
      setSelectedRequest(request);
      console.log('selectedRequest state updated');
    } catch (error) {
      console.error('Failed to fetch request details:', error);
    }
  };

  const handleResendRequest = async (requestId: number) => {
    try {
      await api.resendRequest(requestId);
      // Refresh the requests to see updated relay status
      await fetchRequests();
    } catch (error) {
      console.error('Failed to resend request:', error);
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    
    try {
      await api.deleteRequest(requestId);
      await fetchRequests();
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getRelayStatusIcon = (status: string | null) => {
    if (!status) return <Clock className="h-4 w-4 text-gray-400" />;
    if (status === 'error') return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (status.startsWith('2')) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getRelayStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">No relay</Badge>;
    if (status === 'error') return <Badge variant="destructive">Error</Badge>;
    if (status.startsWith('2')) return <Badge variant="default">Success</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getPreviewValue = (request: WebhookRequest, previewField: string | undefined) => {
    if (!previewField) return null;
    
    try {
      const [source, ...fieldPath] = previewField.split('.');
      const fieldName = fieldPath.join('.');
      
      if (source === 'headers') {
        const headers = typeof request.headers === 'string' 
          ? JSON.parse(request.headers) 
          : request.headers;
        return headers[fieldName] || null;
      } else if (source === 'body') {
        if (!request.body) return null;
        const body = typeof request.body === 'string' 
          ? JSON.parse(request.body) 
          : request.body;
        return fieldPath.reduce((obj, key) => obj?.[key], body) || null;
      } else if (source === 'queryParams') {
        const queryParams = typeof request.queryParams === 'string' 
          ? JSON.parse(request.queryParams) 
          : request.queryParams;
        return queryParams[fieldName] || null;
      }
      return null;
    } catch (error) {
      console.error('Error extracting preview value:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading webhook details...</div>
      </div>
    );
  }

  if (!webhook) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Webhook Not Found</h1>
        </div>
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 ring-1 ring-red-100">
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              The webhook you're looking for doesn't exist or has been deleted.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Webhook: {webhook.path}</h1>
          <p className="text-gray-600 text-sm">
            {import.meta.env.VITE_API_BASE}/webhook/{webhook.path}
          </p>
        </div>
      </div>

      {/* Webhook Info Card */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 ring-1 ring-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <div className="p-1 bg-blue-100 rounded-md">
              <ExternalLink className="h-4 w-4 text-blue-600" />
            </div>
            Webhook Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <Badge variant={webhook.active ? 'default' : 'secondary'}>
                  {webhook.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Target URL</label>
              <div className="mt-1 font-mono text-sm">
                {webhook.targetUrl || <span className="text-gray-400 italic">Not configured</span>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Preview Field</label>
              <div className="mt-1 font-mono text-sm">
                {webhook.previewField || <span className="text-gray-400 italic">Not configured</span>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Created</label>
              <div className="mt-1 text-sm text-gray-600">
                {formatTimestamp(webhook.createdAt)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Updated</label>
              <div className="mt-1 text-sm text-gray-600">
                {formatTimestamp(webhook.updatedAt)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Card */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 ring-1 ring-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <div className="p-1 bg-green-100 rounded-md">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
            Recent Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="text-center py-4 text-gray-500">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No requests received for this webhook yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Method</TableHead>
                  {webhook.previewField && <TableHead>Preview</TableHead>}
                  <TableHead>Relay Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm">
                      {formatTimestamp(request.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.method}</Badge>
                    </TableCell>
                    {webhook.previewField && (
                      <TableCell className="text-sm font-mono max-w-xs truncate">
                        {getPreviewValue(request, webhook.previewField) || 
                          <span className="text-gray-400 italic">-</span>}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRelayStatusIcon(request.relayStatus)}
                        {getRelayStatusBadge(request.relayStatus)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {request.ipAddress}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleViewRequest(request.id)}
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {webhook.targetUrl && (
                          <Button
                            onClick={() => handleResendRequest(request.id)}
                            variant="ghost"
                            size="sm"
                            className="hover:bg-green-50 hover:text-green-600"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteRequest(request.id)}
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedRequest(null)}
          title={`Request Details - ${selectedRequest.method} ${formatTimestamp(selectedRequest.timestamp)}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Method</label>
                <div className="mt-1">
                  <Badge variant="outline">{selectedRequest.method}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">IP Address</label>
                <div className="mt-1 font-mono text-sm">{selectedRequest.ipAddress}</div>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">URL</label>
                <div className="mt-1 font-mono text-sm break-all">{selectedRequest.url}</div>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">User Agent</label>
                <div className="mt-1 text-sm break-all">{selectedRequest.userAgent}</div>
              </div>
            </div>

            {Object.keys(selectedRequest.headers).length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700">Headers</label>
                <div className="mt-1">
                  <CodeHighlighter language="json" code={JSON.stringify(selectedRequest.headers, null, 2)} />
                </div>
              </div>
            )}

            {Object.keys(selectedRequest.queryParams).length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700">Query Parameters</label>
                <div className="mt-1">
                  <CodeHighlighter language="json" code={JSON.stringify(selectedRequest.queryParams, null, 2)} />
                </div>
              </div>
            )}

            {selectedRequest.body && (
              <div>
                <label className="text-sm font-medium text-gray-700">Body</label>
                <div className="mt-1">
                  <CodeHighlighter 
                    language="json" 
                    code={selectedRequest.body.startsWith('{') ? 
                      JSON.stringify(JSON.parse(selectedRequest.body), null, 2) : 
                      selectedRequest.body
                    } 
                  />
                </div>
              </div>
            )}

            {selectedRequest.relayResponse && (
              <div>
                <label className="text-sm font-medium text-gray-700">Relay Response</label>
                <div className="mt-1">
                  <CodeHighlighter 
                    language="json" 
                    code={selectedRequest.relayResponse.startsWith('{') ? 
                      JSON.stringify(JSON.parse(selectedRequest.relayResponse), null, 2) : 
                      selectedRequest.relayResponse
                    } 
                  />
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}