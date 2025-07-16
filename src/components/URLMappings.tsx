import { useState, useEffect } from 'react';
import type { URLMapping } from '../types/webhook';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Trash2, Edit, Plus, Save, X, ExternalLink, Settings } from 'lucide-react';

export default function URLMappings() {
  const [mappings, setMappings] = useState<URLMapping[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newMapping, setNewMapping] = useState({ webhook_path: '', target_url: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editData, setEditData] = useState<Partial<URLMapping>>({});

  const fetchMappings = async () => {
    try {
      const data = await api.getMappings();
      setMappings(data);
    } catch (error) {
      console.error('Failed to fetch mappings:', error);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  const handleCreateMapping = async () => {
    if (!newMapping.webhook_path || !newMapping.target_url) return;
    
    try {
      await api.createMapping(newMapping.webhook_path, newMapping.target_url);
      setNewMapping({ webhook_path: '', target_url: '' });
      setShowAddForm(false);
      fetchMappings();
    } catch (error) {
      console.error('Failed to create mapping:', error);
    }
  };

  const handleUpdateMapping = async (id: number) => {
    try {
      await api.updateMapping(id, editData);
      setEditingId(null);
      setEditData({});
      fetchMappings();
    } catch (error) {
      console.error('Failed to update mapping:', error);
    }
  };

  const handleDeleteMapping = async (id: number) => {
    try {
      await api.deleteMapping(id);
      fetchMappings();
    } catch (error) {
      console.error('Failed to delete mapping:', error);
    }
  };

  const startEditing = (mapping: URLMapping) => {
    setEditingId(mapping.id);
    setEditData({
      webhook_path: mapping.webhook_path,
      target_url: mapping.target_url,
      active: mapping.active,
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
        <h2 className="text-2xl font-bold text-gray-800">URL Mappings</h2>
        <Button 
          onClick={() => setShowAddForm(true)} 
          disabled={showAddForm}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 ring-1 ring-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-1 bg-green-100 rounded-md">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              Create New Mapping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Webhook Path</label>
                <Input
                  placeholder="e.g., my-webhook"
                  value={newMapping.webhook_path}
                  onChange={(e) => setNewMapping({ ...newMapping, webhook_path: e.target.value })}
                  className="bg-white/80"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will be accessible at: <code className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-mono text-xs">{import.meta.env.VITE_API_BASE}/webhook/{newMapping.webhook_path || 'your-path'}</code>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Target URL</label>
                <Input
                  placeholder="https://example.com/webhook"
                  value={newMapping.target_url}
                  onChange={(e) => setNewMapping({ ...newMapping, target_url: e.target.value })}
                  className="bg-white/80"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateMapping}
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
            Active Mappings ({mappings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mappings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No URL mappings configured. Create one to start forwarding webhooks.
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
                {mappings.map((mapping) => (
                  <TableRow key={mapping.id} className="hover:bg-gray-50">
                    <TableCell>
                      {editingId === mapping.id ? (
                        <Input
                          value={editData.webhook_path || ''}
                          onChange={(e) => setEditData({ ...editData, webhook_path: e.target.value })}
                          className="w-full bg-white/80"
                        />
                      ) : (
                        <div className="space-y-1">
                          <div className="font-mono text-sm">{mapping.webhook_path}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            {getWebhookUrl(mapping.webhook_path)}
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === mapping.id ? (
                        <Input
                          value={editData.target_url || ''}
                          onChange={(e) => setEditData({ ...editData, target_url: e.target.value })}
                          className="w-full bg-white/80"
                        />
                      ) : (
                        <div className="font-mono text-sm break-all">
                          {mapping.target_url}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === mapping.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editData.active ?? mapping.active}
                            onChange={(e) => setEditData({ ...editData, active: e.target.checked })}
                          />
                          <span className="text-sm">Active</span>
                        </div>
                      ) : (
                        <Badge variant={mapping.active ? 'default' : 'secondary'}>
                          {mapping.active ? 'Active' : 'Inactive'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatTimestamp(mapping.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {editingId === mapping.id ? (
                          <>
                            <Button
                              onClick={() => handleUpdateMapping(mapping.id)}
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
                              onClick={() => startEditing(mapping)}
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteMapping(mapping.id)}
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