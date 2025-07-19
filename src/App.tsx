import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebhookList from './components/WebhookList';
import WebhookDetail from './components/WebhookDetail';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Webhook, Activity } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={
              <>
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
                          <strong className="text-gray-900">Receive webhooks:</strong> POST to <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-xs">{import.meta.env.VITE_API_BASE}/webhook/your-path</code>
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong className="text-gray-900">Forward webhooks:</strong> Configure target URLs for your webhooks to automatically forward incoming requests
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <WebhookList />
              </>
            } />
            <Route path="/webhooks/:id" element={<WebhookDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App
