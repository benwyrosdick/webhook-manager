# Webhook Manager

A modern unified web application for receiving, viewing, and forwarding webhooks. Built with React, TypeScript, Tailwind CSS, Express.js, and js-record ORM. Features a sleek gradient interface with syntax highlighting, comprehensive webhook management, preview field extraction, and runs as a single Node.js process.

## Features

### Core Functionality
- **Webhook Reception**: Receive webhooks at `http://localhost:3000/webhook/your-path`
- **Request Viewing**: View all incoming webhook requests with detailed information
- **Webhook Management**: Create and manage webhooks with optional target URLs (collect-only mode)
- **Preview Field Extraction**: Extract and display specific data fields from headers, body, or query parameters
- **Real-time Updates**: Auto-refresh webhook requests every 5 seconds without flashing
- **Request Management**: Delete individual requests or clear all requests
- **Unified Architecture**: Single Node.js process serves both API and frontend

### Advanced Features
- **Syntax Highlighting**: JSON syntax highlighting for headers, query parameters, and request bodies
- **Request Details Modal**: View complete request details in a comprehensive modal interface
- **Preview Fields**: Configure custom field extraction (e.g., `headers.x-event-type`, `body.event`, `queryParams.source`)
- **Resend Functionality**: Resend any webhook request to its target endpoint (when configured)
- **Collect-Only Mode**: Create webhooks without target URLs for pure data collection
- **Reliable Webhook Handling**: Always returns 200 status to webhook providers, even on forwarding errors
- **Comprehensive Testing**: Full test suite with 160+ tests covering components, API, and integration

### User Interface
- **Modern Design**: Gradient backgrounds with glass morphism effects
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Keyboard Shortcuts**: ESC key to close modals and other shortcuts
- **Visual Feedback**: Color-coded HTTP methods, status indicators, and hover effects
- **Custom Favicon**: Webhook-themed icon for easy tab identification

## Getting Started

### Prerequisites

- Node.js (v20.14.0 or higher)
- bun package manager
- PostgreSQL database (local or hosted)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Set up your database configuration:

Create a `.env` file in the root directory with your PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/webhook_manager"
```

**For local PostgreSQL setup:**
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb webhook_manager

# Your DATABASE_URL would be:
DATABASE_URL="postgresql://yourusername@localhost:5432/webhook_manager"
```

4. Initialize the database:

The database tables should already exist from previous Prisma migrations. If you're setting up a fresh database, you'll need to create the tables manually using SQL or migrate from the Prisma schema history.

### Running the Application

#### Development (Recommended)
```bash
# Start both frontend and backend with hot reload
bun dev

# This runs:
# - Frontend: http://localhost:8080 (with hot reload)
# - Backend: http://localhost:3000 (with auto-restart)

# Optional: Start ngrok tunnel for public webhook access
bun dev:ngrok
```

#### Alternative Development (Unified)
```bash
# Start unified server (requires manual rebuild after frontend changes)
bun dev:backend

# Then rebuild frontend when needed:
bun build
```

#### Production
```bash
# Build frontend and start production server
bun build:start

# Or build and start separately
bun build
bun start
```

### Accessing the Application

**Development:**
- **Frontend**: `http://localhost:8080` (with hot reload)
- **Backend API**: `http://localhost:3000`
- **Webhooks**: `http://localhost:3000/webhook/your-path`

**Production:**
- **Application**: `http://localhost:3000` (serves both frontend and API)
- **Public Webhook URL**: Check ngrok output for public URL

## Usage

### Receiving Webhooks

Send HTTP requests to `http://localhost:3000/webhook/{path}` where `{path}` is any string you choose.

**Local Example:**
```bash
curl -X POST http://localhost:3000/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello webhook!"}'
```

**Public Example (using ngrok):**
```bash
curl -X POST https://abc123.ngrok.io/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello webhook!"}'
```

### Managing Webhooks and Requests

#### Creating Webhooks
1. **Create Webhook**: Add a new webhook path and optionally configure a target URL
2. **Preview Fields**: Set up field extraction like `headers.x-event-type` to show key data in the requests table
3. **Collect-Only Mode**: Leave target URL empty to only collect and view webhook data
4. **Target URL**: Set a destination URL to automatically forward requests

#### Viewing Requests
1. **Request List**: All incoming webhooks appear with method, timestamp, IP, and status
2. **Preview Column**: When configured, shows extracted field values for quick identification
3. **Request Details**: Click the eye icon to view complete request details including:
   - HTTP method, URL, IP address, and timestamp
   - Syntax-highlighted headers and query parameters
   - Syntax-highlighted request body and relay response
4. **Resend Requests**: Click the send icon to resend any request to its target endpoint (if configured)
5. **Delete Requests**: Remove individual requests as needed

### Preview Field Examples

Configure preview fields to extract key information from your webhooks. You can specify multiple fields by separating them with commas - each field will be displayed on a new line in the requests table.

**Single Field Examples:**
- `headers.x-event-type` - Extract event type from custom headers
- `headers.x-github-event` - GitHub webhook event types
- `headers.x-shopify-test` - Shopify test mode indicator
- `body.event` - Direct event field from JSON body
- `body.data.type` - Nested field extraction
- `body.user.email` - Extract user information
- `queryParams.source` - Request source identification
- `queryParams.version` - API version tracking

**Multiple Field Examples:**
- `headers.x-event-type, body.action` - Show both event type and action
- `body.event, body.user.id, headers.x-source` - Display event, user ID, and source
- `headers.content-type, body.timestamp, queryParams.version` - Multiple data points

## Testing

The project includes comprehensive tests using Vitest and React Testing Library:

```bash
# Run tests in watch mode
bun test

# Run tests once
bun test:run

# Run tests with UI
bun test:ui

# Run tests with coverage
bun test:coverage
```

**Test Coverage:**
- **Component Tests**: React component rendering, user interactions, and webhook management
- **API Service Tests**: HTTP client functionality, webhook operations, and error handling
- **UI Component Tests**: Button, input, card, badge, and table components
- **Integration Tests**: End-to-end webhook creation and preview field functionality
- **Preview Field Tests**: Field extraction from headers, body, and query parameters

**Testing Features:**
- **Mocked Dependencies**: Isolated unit tests with mocked APIs and external libraries
- **User Interaction Testing**: Form submissions, modal interactions, and button clicks
- **Error Handling**: Graceful error handling and user feedback scenarios
- **TypeScript Testing**: Full type safety with proper mocking patterns

## Database Management

The application uses PostgreSQL with js-record ORM for robust data management:

### Database Connection
Database connection is configured via `.env`:
```bash
DATABASE_URL="postgresql://username:password@host:port/database"
```

**Important**: Never commit `.env` to version control. It's already included in `.gitignore`.

### Schema Management
The database uses the following tables:
- `webhooks` - Stores webhook configurations
- `webhook_requests` - Stores incoming webhook requests

Schema changes need to be applied manually via SQL or a migration tool.

## Project Structure

```
webhook-manager/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── ui/            # shadcn-ui components (button, card, table, modal, etc.)
│   │   ├── __tests__/     # Component tests with comprehensive coverage
│   │   ├── WebhookList.tsx        # Webhook management interface
│   │   ├── WebhookDetail.tsx      # Individual webhook details and requests
│   │   └── SyntaxHighlighter.tsx  # Code syntax highlighting
│   ├── services/          # API service layer
│   │   ├── __tests__/     # API service tests
│   │   └── api.ts         # HTTP client for backend API
│   ├── types/             # TypeScript type definitions
│   │   └── webhook.ts     # Webhook and request types
│   ├── models/            # Database models (js-record TypeScript)
│   │   ├── Webhook.ts     # Webhook model
│   │   ├── WebhookRequest.ts  # WebhookRequest model
│   │   └── index.ts       # Model exports
│   ├── db/                # Database configuration
│   │   └── connection.ts  # PostgreSQL adapter setup
│   ├── assets/            # Static assets
│   │   └── icons8-webhook.svg     # Webhook icon (used as favicon)
│   └── App.tsx            # Main application component with routing
├── server.js              # Main Express server (unified frontend + API)
├── public/                # Built frontend files (served by Express)
│   ├── index.html         # Main HTML file
│   ├── webhook.svg        # Favicon (webhook icon)
│   └── assets/            # CSS and JS bundles
└── package.json           # Unified dependencies
```

## API Endpoints

### Webhook Endpoints
- `POST/GET/PUT/DELETE /webhook/*` - Receive webhooks and forward if target URL configured
  - Always returns 200 status for reliable webhook handling
  - Stores all requests in database for inspection
  - Forwards to target URLs when configured

### Webhook Management
- `GET /api/webhooks` - Get all configured webhooks
- `POST /api/webhooks` - Create new webhook (path required, targetUrl and previewField optional)
- `PUT /api/webhooks/:id` - Update webhook configuration
- `DELETE /api/webhooks/:id` - Delete webhook and cascade delete associated requests

### Request Management
- `GET /api/requests` - Get all webhook requests with optional webhook filtering
- `GET /api/requests/:id` - Get specific request details
- `POST /api/requests/:id/resend` - Resend request to target endpoint (if configured)
- `DELETE /api/requests/:id` - Delete specific request

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
- **Database**: PostgreSQL with js-record ORM
- **HTTP Client**: Axios for webhook forwarding
- **CORS**: Enabled for cross-origin requests
- **Architecture**: Unified server serving both API and frontend

### Development Tools
- **Bundler**: Vite with hot module replacement
- **Package Manager**: bun with unified dependencies
- **Tunneling**: ngrok for public webhook access
- **Development Server**: Nodemon for auto-restart
- **Testing**: Vitest with React Testing Library
- **Database**: js-record ORM for ActiveRecord-style database operations
- **Environment Variables**: dotenv for secure credential loading
- **Process Management**: Concurrently for running multiple dev servers

## Development Features

- **Real-time Updates**: Auto-refresh every 5 seconds without UI flashing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Glass Morphism**: Modern UI with backdrop blur effects
- **Keyboard Shortcuts**: ESC to close modals, intuitive navigation
- **Error Handling**: Graceful error handling with user feedback
- **Performance**: Optimized rendering with React best practices

## Deployment with Kamal

This application is configured for deployment using [Kamal](https://kamal-deploy.org/), a deployment tool that makes it easy to deploy web applications to servers.

### Prerequisites

1. **Install Kamal**:
   ```bash
   gem install kamal
   # Or using Homebrew (macOS)
   brew install kamal
   ```

2. **Docker Hub Account** (or another container registry):
   - Create an account at [Docker Hub](https://hub.docker.com/)
   - Generate an access token for authentication

3. **Server Requirements**:
   - A server with Docker installed
   - SSH access with sudo privileges
   - PostgreSQL database (can be on the same server or separate)

### Configuration

1. **Update `config/deploy.yml`**:
   - Replace `your-dockerhub-username` with your Docker Hub username
   - Replace `your-server-ip-or-domain` with your server's IP address or domain
   - Update the `user` field if you're not using `root`
   - Adjust the `port.host` if you want to use a different port (default is 3000)

2. **Set up environment secrets**:
   ```bash
   kamal secret set DATABASE_URL postgresql://user:password@host:5432/webhook_manager
   kamal secret set KAMAL_REGISTRY_PASSWORD your-dockerhub-access-token
   ```

3. **Configure database**:
   - You can use an external PostgreSQL database
   - Or configure a PostgreSQL accessory service in `config/deploy.yml` (commented out)
   - Make sure your `DATABASE_URL` secret points to your database

### Deploying

1. **Build and deploy**:
   ```bash
   kamal setup    # First time setup - builds image, sets up containers
   kamal deploy   # Subsequent deployments
   ```

2. **View logs**:
   ```bash
   kamal app logs
   kamal app logs -f  # Follow logs
   ```

3. **Access your application**:
   - The app will be available at `http://your-server-ip-or-domain:3000`
   - Or configure a reverse proxy (nginx, Traefik, etc.) for a custom domain

### Useful Kamal Commands

```bash
# Deploy the application
kamal deploy

# Check application health
kamal app details

# View logs
kamal app logs -f

# Execute commands in the container
kamal app exec -- "bun prisma studio"

# Rollback to previous version
kamal rollback

# Stop the application
kamal app stop

# Start the application
kamal app start

# Remove everything (containers, images)
kamal remove
```

### Database Setup

The database tables should already exist. If deploying to a fresh database, you'll need to create the necessary tables using SQL scripts or by exporting from an existing database.

### Troubleshooting

- **Build failures**: Check Docker Hub credentials and network connectivity
- **Database connection errors**: Verify `DATABASE_URL` secret is set correctly
- **Port conflicts**: Change `port.host` in `config/deploy.yml` if port 3000 is in use
- **Permission issues**: Ensure the SSH user has sudo privileges
- **Health check failures**: Verify the application is responding on port 3000 in the container

For more information, see the [Kamal documentation](https://kamal-deploy.org/docs).
