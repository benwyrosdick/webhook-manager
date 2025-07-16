import { useState, useEffect } from 'react';
import type { URLMapping } from '../types/webhook';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Trash2, Edit, Plus, Save, X, ExternalLink } from 'lucide-react';

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
    return `http://localhost:3001/webhook/${path}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">URL Mappings</h2>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Webhook Path</label>
                <Input
                  placeholder="e.g., my-webhook"
                  value={newMapping.webhook_path}
                  onChange={(e) => setNewMapping({ ...newMapping, webhook_path: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Will be accessible at: http://localhost:3001/webhook/{newMapping.webhook_path || 'your-path'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Target URL</label>
                <Input
                  placeholder="https://example.com/webhook"
                  value={newMapping.target_url}
                  onChange={(e) => setNewMapping({ ...newMapping, target_url: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateMapping}>
                  <Save className="h-4 w-4 mr-2" />
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active Mappings ({mappings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {mappings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
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
                  <TableRow key={mapping.id}>
                    <TableCell>
                      {editingId === mapping.id ? (
                        <Input
                          value={editData.webhook_path || ''}
                          onChange={(e) => setEditData({ ...editData, webhook_path: e.target.value })}
                          className="w-full"
                        />
                      ) : (
                        <div className="space-y-1">
                          <div className="font-mono text-sm">{mapping.webhook_path}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
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
                          className="w-full"
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
                    <TableCell className="text-sm text-muted-foreground">
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
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={cancelEditing}
                              variant="ghost"
                              size="sm"
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
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteMapping(mapping.id)}
                              variant="ghost"
                              size="sm"
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