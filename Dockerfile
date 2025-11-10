FROM oven/bun:1 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN bun prisma generate

# Build frontend with secret
RUN --mount=type=secret,id=VITE_API_BASE \
    export VITE_API_BASE=$(cat /run/secrets/VITE_API_BASE) && \
    bun run build

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
CMD ["sh", "-c", "bun prisma migrate deploy && bun prisma generate && bun server.js"]

