import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Webhook } from '../types/webhook';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useToast, ToastContainer } from './ui/toast';
import { Plus, Save, X, Copy, Eye, Trash2, Edit } from 'lucide-react';

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
  const { toasts, removeToast, success, error } = useToast();

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success('Copied to clipboard', 'Webhook URL has been copied to your clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      error('Copy failed', 'Failed to copy webhook URL to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading webhooks...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
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
            <div className="p-1 bg-gray-100 rounded-md">
              <WebhookIcon className="h-4 w-4 text-gray-600" />
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
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <Card key={webhook.id} className="bg-gray-50/80 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {editingId === webhook.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Webhook Path</label>
                            <Input
                              value={editData.path || ''}
                              onChange={(e) => setEditData({ ...editData, path: e.target.value })}
                              className="bg-white/80"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Target URL</label>
                            <Input
                              value={editData.targetUrl || ''}
                              onChange={(e) => setEditData({ ...editData, targetUrl: e.target.value })}
                              className="bg-white/80"
                              placeholder="https://example.com/webhook"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Preview Field</label>
                            <Input
                              value={editData.previewField || ''}
                              onChange={(e) => setEditData({ ...editData, previewField: e.target.value })}
                              className="bg-white/80"
                              placeholder="headers.x-field or body.event"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                            <div className="flex items-center gap-2 pt-2">
                              <input
                                type="checkbox"
                                checked={editData.active ?? webhook.active}
                                onChange={(e) => setEditData({ ...editData, active: e.target.checked })}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">Active</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleUpdateWebhook(webhook.id)}
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            onClick={cancelEditing}
                            variant="outline"
                            size="sm"
                            className="bg-white/80"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-mono text-lg font-semibold text-gray-900">{webhook.path}</h3>
                              <Badge variant={webhook.active ? 'default' : 'secondary'}>
                                {webhook.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                              <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {getWebhookUrl(webhook.path)}
                              </span>
                              <button
                                onClick={() => copyToClipboard(getWebhookUrl(webhook.path))}
                                className="hover:text-blue-600 transition-colors"
                                title="Copy webhook URL"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-4">
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
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-14 gap-4 text-sm">
                          <div className="col-span-7">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target URL</label>
                            <div className="mt-1 font-mono text-sm">
                              {webhook.targetUrl ? (
                                <span className="text-blue-600 break-all">{webhook.targetUrl}</span>
                              ) : (
                                <span className="text-gray-400 italic">Collect only</span>
                              )}
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preview Field</label>
                            <div className="mt-1 font-mono text-sm">
                              {webhook.previewField ? (
                                <span className="text-purple-600">{webhook.previewField}</span>
                              ) : (
                                <span className="text-gray-400 italic">Not configured</span>
                              )}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Requests</label>
                            <div className="mt-1">
                              <Link 
                                to={`/webhooks/${webhook.id}`}
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              >
                                <Eye className="h-3 w-3" />
                                {(webhook as any).requestCount || 0} requests
                              </Link>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</label>
                            <div className="mt-1 text-gray-600">
                              {formatTimestamp(webhook.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </>
  );
}