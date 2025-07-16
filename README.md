# Webhook Manager

A modern unified web application for receiving, viewing, and forwarding webhooks. Built with React, TypeScript, Tailwind CSS, Express.js, and Prisma. Features a sleek gradient interface with syntax highlighting, comprehensive webhook management, and runs as a single Node.js process.

## Features

### Core Functionality
- **Webhook Reception**: Receive webhooks at `http://localhost:3001/webhook/your-path`
- **Request Viewing**: View all incoming webhook requests with detailed information
- **URL Mapping**: Create mappings to forward webhooks to target URLs
- **Real-time Updates**: Auto-refresh webhook requests every 5 seconds without flashing
- **Request Management**: Delete individual requests or clear all requests
- **Unified Architecture**: Single Node.js process serves both API and frontend

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
2. Install dependencies:

```bash
yarn install
```

### Running the Application

#### Development
```bash
# Start the unified application (frontend + backend)
yarn dev

# Optional: Start ngrok tunnel for public webhook access
yarn dev:ngrok
```

#### Production
```bash
# Build frontend and start production server
yarn build:start

# Or build and start separately
yarn build
yarn start
```

### Accessing the Application

- **Application**: `http://localhost:3001` (serves both frontend and API)
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
│   │   └── SyntaxHighlighter.tsx # Code syntax highlighting
│   ├── services/          # API service layer
│   │   └── api.ts         # HTTP client for backend API
│   ├── types/             # TypeScript type definitions
│   │   └── webhook.ts     # Webhook and mapping types
│   └── App.tsx            # Main application component
├── server.js              # Main Express server (unified frontend + API)
├── prisma-client.js       # Prisma database client
├── prisma/                # Database configuration
│   ├── schema.prisma      # Database schema
│   └── webhook.db         # SQLite database file
├── public/                # Built frontend files (served by Express)
│   ├── index.html         # Main HTML file
│   ├── assets/            # CSS and JS bundles
│   └── *.svg              # Favicon and icons
├── generated/             # Prisma generated client
└── package.json           # Unified dependencies
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
- **Database**: SQLite with Prisma ORM
- **HTTP Client**: Axios for webhook forwarding
- **CORS**: Enabled for cross-origin requests
- **Architecture**: Unified server serving both API and frontend

### Development Tools
- **Bundler**: Vite with hot module replacement
- **Package Manager**: Yarn with unified dependencies
- **Tunneling**: ngrok for public webhook access
- **Development Server**: Nodemon for auto-restart
- **Testing**: Vitest with React Testing Library
- **Database**: Prisma for type-safe database operations

## Development Features

- **Real-time Updates**: Auto-refresh every 5 seconds without UI flashing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Glass Morphism**: Modern UI with backdrop blur effects
- **Keyboard Shortcuts**: ESC to close modals, intuitive navigation
- **Error Handling**: Graceful error handling with user feedback
- **Performance**: Optimized rendering with React best practices
