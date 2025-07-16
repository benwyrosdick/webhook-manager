import { useState, useEffect } from 'react';
import type { WebhookRequest } from '../types/webhook';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Modal } from './ui/modal';
import { CodeHighlighter } from './SyntaxHighlighter';
import { Trash2, Eye, RefreshCw, Maximize2, Activity, Send } from 'lucide-react';

export default function WebhookRequests() {
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resendingId, setResendingId] = useState<number | null>(null);

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

  const handleResendRequest = async (id: number) => {
    try {
      setResendingId(id);
      const result = await api.resendRequest(id);
      
      if (result.success) {
        alert(`Request resent successfully! Status: ${result.status}`);
      } else {
        alert(`Resend failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to resend request:', error);
      alert('Failed to resend request');
    } finally {
      setResendingId(null);
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


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Webhook Requests</h2>
        <div className="flex gap-2">
          <Button 
            onClick={fetchRequests} 
            variant="outline" 
            size="sm"
            className="bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 text-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={handleClearAll} 
            variant="destructive" 
            size="sm"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 ring-1 ring-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-1 bg-blue-100 rounded-md">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              Recent Requests ({requests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-gray-600">Loading...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No webhook requests yet. Send a POST to <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-xs">http://localhost:3001/webhook/your-path</code>
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
                    <TableRow key={request.id} className={selectedRequest?.id === request.id ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                      <TableCell>
                        <Badge className={`${getMethodColor(request.method)} text-white shadow-sm`}>
                          {request.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {request.url}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatTimestamp(request.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => setSelectedRequest(request)}
                            variant="ghost"
                            size="sm"
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleResendRequest(request.id)}
                            variant="ghost"
                            size="sm"
                            disabled={resendingId === request.id}
                            className="hover:bg-green-50 hover:text-green-600"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
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

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 ring-1 ring-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-indigo-100 rounded-md">
                  <Eye className="h-4 w-4 text-indigo-600" />
                </div>
                Request Details
              </div>
              {selectedRequest && (
                <Button
                  onClick={() => handleResendRequest(selectedRequest.id)}
                  variant="outline"
                  size="sm"
                  disabled={resendingId === selectedRequest.id}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600 shadow-sm"
                >
                  <Send className="h-3 w-3 mr-1" />
                  {resendingId === selectedRequest.id ? 'Resending...' : 'Resend'}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRequest ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Basic Info</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong className="text-gray-900">Method:</strong> <span className="text-gray-700">{selectedRequest.method}</span></div>
                    <div><strong className="text-gray-900">URL:</strong> <span className="text-gray-700 font-mono">{selectedRequest.url}</span></div>
                    <div><strong className="text-gray-900">IP:</strong> <span className="text-gray-700">{selectedRequest.ip_address}</span></div>
                    <div><strong className="text-gray-900">Time:</strong> <span className="text-gray-700">{formatTimestamp(selectedRequest.timestamp)}</span></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Headers</h4>
                  <CodeHighlighter 
                    code={JSON.stringify(selectedRequest.headers)}
                    language="json"
                    className="max-h-32 overflow-auto"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Query Parameters</h4>
                  <CodeHighlighter 
                    code={JSON.stringify(selectedRequest.query_params)}
                    language="json"
                    className="max-h-32 overflow-auto"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">Body</h4>
                    {selectedRequest.body && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 shadow-sm"
                      >
                        <Maximize2 className="h-3 w-3" />
                        Full Screen
                      </Button>
                    )}
                  </div>
                  <CodeHighlighter 
                    code={selectedRequest.body || ''}
                    language="json"
                    className="max-h-48 overflow-auto"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a request to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full-screen Body Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Request Body - ${selectedRequest?.method} ${selectedRequest?.url}`}
      >
        <CodeHighlighter 
          code={selectedRequest?.body || ''}
          language="json"
          className="h-full"
        />
      </Modal>
    </div>
  );
}