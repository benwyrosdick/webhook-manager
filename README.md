# Webhook Manager

A web application for receiving, viewing, and forwarding webhooks built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui.

## Features

- **Webhook Reception**: Receive webhooks at `http://localhost:3001/webhook/your-path`
- **Request Viewing**: View all incoming webhook requests with detailed information
- **URL Mapping**: Create mappings to forward webhooks to target URLs
- **Real-time Updates**: Auto-refresh webhook requests every 5 seconds
- **Request Management**: Delete individual requests or clear all requests
- **Modern UI**: Clean interface built with shadcn-ui components

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

1. Start the backend server:
```bash
cd server
yarn dev
```

2. In a new terminal, start the frontend:
```bash
yarn dev
```

3. Open your browser and navigate to `http://localhost:3000`

The backend server will run on `http://localhost:3001`

## Usage

### Receiving Webhooks

Send HTTP requests to `http://localhost:3001/webhook/{path}` where `{path}` is any string you choose.

Example:
```bash
curl -X POST http://localhost:3001/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello webhook!"}'
```

### URL Mappings

1. Go to the "URL Mappings" tab
2. Click "Add Mapping"
3. Enter a webhook path (e.g., `github`)
4. Enter a target URL (e.g., `https://your-app.com/webhook`)
5. The webhook will automatically forward requests from `http://localhost:3001/webhook/github` to your target URL

## Project Structure

```
webhook-manager/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── ui/            # shadcn-ui components
│   │   ├── WebhookRequests.tsx
│   │   └── URLMappings.tsx
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main application component
├── server/                # Backend Express server
│   ├── server.js          # Main server file
│   ├── database.js        # SQLite database setup
│   └── package.json       # Backend dependencies
└── README.md
```

## API Endpoints

### Webhook Endpoints
- `POST/GET/PUT/DELETE /webhook/*` - Receive webhooks and forward if mapping exists

### Request Management
- `GET /api/requests` - Get all webhook requests
- `GET /api/requests/:id` - Get specific request
- `DELETE /api/requests/:id` - Delete specific request
- `DELETE /api/requests` - Clear all requests

### URL Mappings
- `GET /api/mappings` - Get all URL mappings
- `POST /api/mappings` - Create new mapping
- `PUT /api/mappings/:id` - Update mapping
- `DELETE /api/mappings/:id` - Delete mapping

## Technologies Used

- **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn-ui
- **Backend**: Node.js, Express.js, SQLite3
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Development

The application uses:
- SQLite for data persistence
- CORS enabled for cross-origin requests
- Auto-refresh for real-time updates
- Responsive design with Tailwind CSS
