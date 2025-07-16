import { useState, useEffect } from 'react';
import type { WebhookRequest } from '../types/webhook';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Eye, RefreshCw } from 'lucide-react';

export default function WebhookRequests() {
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDeleteRequest = async (id: number) => {
    try {
      await api.deleteRequest(id);
      setRequests(requests.filter(req => req.id !== id));
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.clearAllRequests();
      setRequests([]);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to clear requests:', error);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      case 'PATCH': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatJSON = (str: string) => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Webhook Requests</h2>
        <div className="flex gap-2">
          <Button onClick={fetchRequests} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleClearAll} variant="destructive" size="sm">
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests ({requests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No webhook requests yet. Send a POST to http://localhost:3001/webhook/your-path
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id} className={selectedRequest?.id === request.id ? 'bg-muted' : ''}>
                      <TableCell>
                        <Badge className={`${getMethodColor(request.method)} text-white`}>
                          {request.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {request.url}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimestamp(request.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => setSelectedRequest(request)}
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteRequest(request.id)}
                            variant="ghost"
                            size="sm"
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

        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRequest ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Info</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Method:</strong> {selectedRequest.method}</div>
                    <div><strong>URL:</strong> {selectedRequest.url}</div>
                    <div><strong>IP:</strong> {selectedRequest.ip_address}</div>
                    <div><strong>Time:</strong> {formatTimestamp(selectedRequest.timestamp)}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Headers</h4>
                  <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-32">
                    {formatJSON(JSON.stringify(selectedRequest.headers))}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Query Parameters</h4>
                  <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-32">
                    {formatJSON(JSON.stringify(selectedRequest.query_params))}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Body</h4>
                  <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-48">
                    {selectedRequest.body ? formatJSON(selectedRequest.body) : 'Empty'}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a request to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}