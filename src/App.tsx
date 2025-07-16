import { useState } from 'react';
import WebhookRequests from './components/WebhookRequests';
import URLMappings from './components/URLMappings';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Webhook, Settings, Activity } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'requests' | 'mappings'>('requests');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Webhook className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Webhook Manager</h1>
          </div>
          <p className="text-muted-foreground">
            Capture, view, and forward webhooks with ease
          </p>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Receive webhooks:</strong> POST to <code className="bg-muted px-2 py-1 rounded">http://localhost:3001/webhook/your-path</code>
                </p>
                <p className="text-sm">
                  <strong>Forward webhooks:</strong> Create URL mappings to automatically forward incoming webhooks to your target URLs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'requests' ? 'default' : 'outline'}
              onClick={() => setActiveTab('requests')}
            >
              <Activity className="h-4 w-4 mr-2" />
              Webhook Requests
            </Button>
            <Button
              variant={activeTab === 'mappings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('mappings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              URL Mappings
            </Button>
          </div>
        </div>

        {activeTab === 'requests' && <WebhookRequests />}
        {activeTab === 'mappings' && <URLMappings />}
      </div>
    </div>
  );
}

export default App
