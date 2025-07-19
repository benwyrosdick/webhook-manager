import { useState, useEffect } from 'react';
import type { Webhook } from '../types/webhook';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Trash2, Edit, Plus, Save, X, ExternalLink, Settings } from 'lucide-react';

export default function URLMappings() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newWebhook, setNewWebhook] = useState({ path: '', targetUrl: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editData, setEditData] = useState<Partial<Webhook>>({});

  const fetchWebhooks = async () => {
    try {
      const data = await api.getWebhooks();
      setWebhooks(data);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleCreateWebhook = async () => {
    if (!newWebhook.path || !newWebhook.targetUrl) return;
    
    try {
      await api.createWebhook(newWebhook.path, newWebhook.targetUrl);
      setNewWebhook({ path: '', targetUrl: '' });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Webhooks</h2>
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
                <label className="text-sm font-medium text-gray-700">Target URL</label>
                <Input
                  placeholder="https://example.com/webhook"
                  value={newWebhook.targetUrl}
                  onChange={(e) => setNewWebhook({ ...newWebhook, targetUrl: e.target.value })}
                  className="bg-white/80"
                />
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
              <Settings className="h-4 w-4 text-blue-600" />
            </div>
            Active Webhooks ({webhooks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No webhooks configured. Create one to start forwarding webhooks.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Webhook Path</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead>Status</TableHead>
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
                          <div className="font-mono text-sm">{webhook.path}</div>
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
                          {webhook.targetUrl}
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