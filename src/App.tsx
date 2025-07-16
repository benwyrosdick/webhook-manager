import { useState } from 'react';
import WebhookRequests from './components/WebhookRequests';
import URLMappings from './components/URLMappings';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Webhook, Settings, Activity } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'requests' | 'mappings'>('requests');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <Webhook className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Webhook Manager
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Capture, view, and forward webhooks with ease
          </p>
        </div>

        <div className="mb-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 ring-1 ring-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="p-1 bg-green-100 rounded-md">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Receive webhooks:</strong> POST to <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-xs">http://localhost:3001/webhook/your-path</code>
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Forward webhooks:</strong> Create URL mappings to automatically forward incoming webhooks to your target URLs
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
              className={activeTab === 'requests' 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg' 
                : 'bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 text-gray-700'
              }
            >
              <Activity className="h-4 w-4 mr-2" />
              Webhook Requests
            </Button>
            <Button
              variant={activeTab === 'mappings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('mappings')}
              className={activeTab === 'mappings' 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg' 
                : 'bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 text-gray-700'
              }
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
