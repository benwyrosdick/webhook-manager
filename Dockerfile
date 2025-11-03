FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build argument for VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

# Generate Prisma client
RUN yarn prisma generate

# Build frontend
RUN yarn build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma-client.js ./
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Run database migrations and start server
CMD ["sh", "-c", "yarn prisma migrate deploy && yarn prisma generate && node server.js"]

