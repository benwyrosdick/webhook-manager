import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Webhook } from '../types/webhook';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Plus, Save, X, ExternalLink, Eye, Trash2, Edit } from 'lucide-react';

// Webhook Icon Component
const WebhookIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 48 48" 
    className={className}
  >
    <path fill="#37474f" d="M35,37c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S37.2,37,35,37z"/>
    <path fill="#37474f" d="M35,43c-3,0-5.9-1.4-7.8-3.7l3.1-2.5c1.1,1.4,2.9,2.3,4.7,2.3c3.3,0,6-2.7,6-6s-2.7-6-6-6 c-1,0-2,0.3-2.9,0.7l-1.7,1L23.3,16l3.5-1.9l5.3,9.4c1-0.3,2-0.5,3-0.5c5.5,0,10,4.5,10,10S40.5,43,35,43z"/>
    <path fill="#37474f" d="M14,43C8.5,43,4,38.5,4,33c0-4.6,3.1-8.5,7.5-9.7l1,3.9C9.9,27.9,8,30.3,8,33c0,3.3,2.7,6,6,6 s6-2.7,6-6v-2h15v4H23.8C22.9,39.6,18.8,43,14,43z"/>
    <path fill="#e91e63" d="M14,37c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S16.2,37,14,37z"/>
    <path fill="#37474f" d="M25,19c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S27.2,19,25,19z"/>
    <path fill="#e91e63" d="M15.7,34L12.3,32l5.9-9.7c-2-1.9-3.2-4.5-3.2-7.3c0-5.5,4.5-10,10-10c5.5,0,10,4.5,10,10 c0,0.9-0.1,1.7-0.3,2.5l-3.9-1c0.1-0.5,0.2-1,0.2-1.5c0-3.3-2.7-6-6-6s-6,2.7-6,6c0,2.1,1.1,4,2.9,5.1l1.7,1L15.7,34z"/>
  </svg>
);

export default function WebhookList() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newWebhook, setNewWebhook] = useState({ path: '', targetUrl: '', previewField: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editData, setEditData] = useState<Partial<Webhook>>({});
  const [loading, setLoading] = useState(true);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const data = await api.getWebhooks();
      setWebhooks(data);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleCreateWebhook = async () => {
    if (!newWebhook.path) return;
    
    try {
      await api.createWebhook(newWebhook.path, newWebhook.targetUrl, newWebhook.previewField);
      setNewWebhook({ path: '', targetUrl: '', previewField: '' });
      setShowAddForm(false);
      fetchWebhooks();
    } catch (error) {
      console.error('Failed to create webhook:', error);
    }
  };

  const handleUpdateWebhook = async (id: number) => {
    try {
      await api.updateWebhook(id, editData);
      setEditingId(null);
      setEditData({});
      fetchWebhooks();
    } catch (error) {
      console.error('Failed to update webhook:', error);
    }
  };

  const handleDeleteWebhook = async (id: number) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;
    
    try {
      await api.deleteWebhook(id);
      fetchWebhooks();
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  };

  const startEditing = (webhook: Webhook) => {
    setEditingId(webhook.id);
    setEditData({
      path: webhook.path,
      targetUrl: webhook.targetUrl,
      previewField: webhook.previewField,
      active: webhook.active,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getWebhookUrl = (path: string) => {
    return `${import.meta.env.VITE_API_BASE}/webhook/${path}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading webhooks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Webhook Manager
        </h1>
        <Button 
          onClick={() => setShowAddForm(true)} 
          disabled={showAddForm}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 ring-1 ring-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-1 bg-green-100 rounded-md">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              Create New Webhook
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Webhook Path</label>
                <Input
                  placeholder="e.g., my-webhook"
                  value={newWebhook.path}
                  onChange={(e) => setNewWebhook({ ...newWebhook, path: e.target.value })}
                  className="bg-white/80"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will be accessible at: <code className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-mono text-xs">{import.meta.env.VITE_API_BASE}/webhook/{newWebhook.path || 'your-path'}</code>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Target URL (Optional)</label>
                <Input
                  placeholder="https://example.com/webhook (leave empty to collect only)"
                  value={newWebhook.targetUrl}
                  onChange={(e) => setNewWebhook({ ...newWebhook, targetUrl: e.target.value })}
                  className="bg-white/80"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Preview Field (Optional)</label>
                <Input
                  placeholder="headers.x-shopify-test or body.event_type"
                  value={newWebhook.previewField}
                  onChange={(e) => setNewWebhook({ ...newWebhook, previewField: e.target.value })}
                  className="bg-white/80"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Field path to show in requests table. Examples: <code>headers.content-type</code>, <code>body.event</code>
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateWebhook}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 ring-1 ring-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <div className="p-1 bg-blue-100 rounded-md">
              <WebhookIcon className="h-4 w-4 text-blue-600" />
            </div>
            Webhooks ({webhooks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No webhooks configured. Create one to start receiving webhooks.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Webhook Path</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead>Preview Field</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id} className="hover:bg-gray-50">
                    <TableCell>
                      {editingId === webhook.id ? (
                        <Input
                          value={editData.path || ''}
                          onChange={(e) => setEditData({ ...editData, path: e.target.value })}
                          className="w-full bg-white/80"
                        />
                      ) : (
                        <div className="space-y-1">
                          <div className="font-mono text-sm font-medium">{webhook.path}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            {getWebhookUrl(webhook.path)}
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === webhook.id ? (
                        <Input
                          value={editData.targetUrl || ''}
                          onChange={(e) => setEditData({ ...editData, targetUrl: e.target.value })}
                          className="w-full bg-white/80"
                        />
                      ) : (
                        <div className="font-mono text-sm break-all">
                          {webhook.targetUrl || <span className="text-gray-400 italic">Not configured</span>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === webhook.id ? (
                        <Input
                          value={editData.previewField || ''}
                          onChange={(e) => setEditData({ ...editData, previewField: e.target.value })}
                          className="w-full bg-white/80"
                          placeholder="headers.x-field or body.event"
                        />
                      ) : (
                        <div className="font-mono text-sm break-all">
                          {webhook.previewField || <span className="text-gray-400 italic">Not configured</span>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === webhook.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editData.active ?? webhook.active}
                            onChange={(e) => setEditData({ ...editData, active: e.target.checked })}
                          />
                          <span className="text-sm">Active</span>
                        </div>
                      ) : (
                        <Badge variant={webhook.active ? 'default' : 'secondary'}>
                          {webhook.active ? 'Active' : 'Inactive'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/webhooks/${webhook.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <Eye className="h-3 w-3" />
                        {(webhook as any).requestCount || 0} requests
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatTimestamp(webhook.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {editingId === webhook.id ? (
                          <>
                            <Button
                              onClick={() => handleUpdateWebhook(webhook.id)}
                              variant="ghost"
                              size="sm"
                              className="hover:bg-green-50 hover:text-green-600"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={cancelEditing}
                              variant="ghost"
                              size="sm"
                              className="hover:bg-gray-50 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => startEditing(webhook)}
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteWebhook(webhook.id)}
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}