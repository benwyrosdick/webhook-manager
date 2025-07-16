# Webhook Manager

A modern web application for receiving, viewing, and forwarding webhooks built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui. Features a sleek gradient interface with syntax highlighting and comprehensive webhook management capabilities.

## Features

### Core Functionality
- **Webhook Reception**: Receive webhooks at `http://localhost:3001/webhook/your-path`
- **Request Viewing**: View all incoming webhook requests with detailed information
- **URL Mapping**: Create mappings to forward webhooks to target URLs
- **Real-time Updates**: Auto-refresh webhook requests every 5 seconds without flashing
- **Request Management**: Delete individual requests or clear all requests

### Advanced Features
- **Syntax Highlighting**: JSON syntax highlighting for headers, query parameters, and request bodies
- **Full-screen Modal**: View request bodies in a full-screen modal with syntax highlighting
- **Resend Functionality**: Resend any webhook request to its mapped endpoint
- **Reliable Webhook Handling**: Always returns 200 status to webhook providers, even on forwarding errors
- **ngrok Integration**: Built-in ngrok tunnel for exposing local webhooks publicly

### User Interface
- **Modern Design**: Gradient backgrounds with glass morphism effects
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Keyboard Shortcuts**: ESC key to close modals and other shortcuts
- **Visual Feedback**: Color-coded HTTP methods, status indicators, and hover effects
- **Custom Favicon**: Webhook-themed icon for easy tab identification

## Getting Started

### Prerequisites

- Node.js (v20.14.0 or higher)
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
yarn install

# Install backend dependencies
cd server
yarn install
cd ..
```

### Running the Application

#### Option 1: Run Both Services Together (Recommended)
```bash
# Terminal 1: Start both frontend and backend
yarn dev

# Terminal 2: Start ngrok tunnel (optional)
yarn dev:ngrok
```

#### Option 2: Run Services Separately
```bash
# Terminal 1: Start backend server
cd server
yarn dev

# Terminal 2: Start frontend
yarn dev

# Terminal 3: Start ngrok tunnel (optional)
yarn dev:ngrok
```

### Accessing the Application

- **Frontend**: `http://localhost:8080`
- **Backend API**: `http://localhost:3001`
- **Public Webhook URL**: Check ngrok output for public URL

## Usage

### Receiving Webhooks

Send HTTP requests to `http://localhost:3001/webhook/{path}` where `{path}` is any string you choose.

**Local Example:**
```bash
curl -X POST http://localhost:3001/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello webhook!"}'
```

**Public Example (using ngrok):**
```bash
curl -X POST https://abc123.ngrok.io/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello webhook!"}'
```

### Managing Webhook Requests

1. **View Requests**: All incoming webhooks appear in the "Webhook Requests" tab
2. **Request Details**: Click the eye icon to view full request details including:
   - HTTP method, URL, IP address, and timestamp
   - Syntax-highlighted headers and query parameters
   - Syntax-highlighted request body
3. **Full-screen View**: Click "Full Screen" to view request bodies in a modal
4. **Resend Requests**: Click the send icon to resend any request to its mapped endpoint
5. **Delete Requests**: Remove individual requests or clear all requests

### URL Mappings

1. Go to the "URL Mappings" tab
2. Click "Add Mapping"
3. Enter a webhook path (e.g., `github`)
4. Enter a target URL (e.g., `https://your-app.com/webhook`)
5. The webhook will automatically forward requests from `http://localhost:3001/webhook/github` to your target URL

**Features:**
- **Real-time editing**: Click edit icon to modify mappings inline
- **Status toggle**: Enable/disable mappings without deleting
- **Reliable forwarding**: Always returns 200 to webhook providers
- **Error handling**: Forwarding failures are logged but don't break webhook reception

## Testing

The project includes comprehensive tests using Vitest and React Testing Library:

```bash
# Run tests in watch mode
yarn test

# Run tests once
yarn test:run

# Run tests with UI
yarn test:ui

# Run tests with coverage
yarn test:coverage
```

**Test Coverage:**
- **API Service Tests**: HTTP client functionality and error handling
- **Utility Function Tests**: Helper functions and class name utilities
- **Component Tests**: React component rendering and user interactions
- **Integration Tests**: App-level functionality and routing

**Testing Features:**
- **Mocked Dependencies**: Isolated unit tests with mocked fetch and external libraries
- **User Interaction Testing**: Keyboard shortcuts, button clicks, and form submissions
- **Error Boundary Testing**: Graceful error handling and user feedback
- **Accessibility Testing**: ARIA attributes and keyboard navigation

## Project Structure

```
webhook-manager/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── ui/            # shadcn-ui components (button, card, table, etc.)
│   │   ├── WebhookRequests.tsx   # Main webhook requests interface
│   │   ├── URLMappings.tsx       # URL mapping management
│   │   ├── SyntaxHighlighter.tsx # Code syntax highlighting
│   │   └── Modal.tsx             # Full-screen modal component
│   ├── services/          # API service layer
│   │   └── api.ts         # HTTP client for backend API
│   ├── types/             # TypeScript type definitions
│   │   └── webhook.ts     # Webhook and mapping types
│   └── App.tsx            # Main application component
├── server/                # Backend Express server
│   ├── server.js          # Main server file with webhook handling
│   ├── database.js        # SQLite database setup and migrations
│   └── package.json       # Backend dependencies
├── public/                # Static assets
│   └── webhook.svg        # Custom webhook favicon
└── README.md
```

## API Endpoints

### Webhook Endpoints
- `POST/GET/PUT/DELETE /webhook/*` - Receive webhooks and forward if mapping exists
  - Always returns 200 status for reliable webhook handling
  - Stores all requests in database for inspection
  - Forwards to mapped URLs when available

### Request Management
- `GET /api/requests` - Get all webhook requests (supports limit/offset)
- `GET /api/requests/:id` - Get specific request details
- `POST /api/requests/:id/resend` - Resend request to mapped endpoint
- `DELETE /api/requests/:id` - Delete specific request
- `DELETE /api/requests` - Clear all requests

### URL Mappings
- `GET /api/mappings` - Get all URL mappings
- `POST /api/mappings` - Create new mapping
- `PUT /api/mappings/:id` - Update mapping (path, URL, active status)
- `DELETE /api/mappings/:id` - Delete mapping

## Technologies Used

### Frontend
- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom gradients
- **UI Components**: shadcn-ui with custom modifications
- **Syntax Highlighting**: react-syntax-highlighter with Prism
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom wrapper

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: SQLite3 with custom schema
- **HTTP Client**: Axios for webhook forwarding
- **CORS**: Enabled for cross-origin requests

### Development Tools
- **Bundler**: Vite with hot module replacement
- **Package Manager**: Yarn workspaces
- **Tunneling**: ngrok for public webhook access
- **Process Management**: Concurrently for multi-service startup
- **Testing**: Vitest with React Testing Library

## Development Features

- **Real-time Updates**: Auto-refresh every 5 seconds without UI flashing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Glass Morphism**: Modern UI with backdrop blur effects
- **Keyboard Shortcuts**: ESC to close modals, intuitive navigation
- **Error Handling**: Graceful error handling with user feedback
- **Performance**: Optimized rendering with React best practices
