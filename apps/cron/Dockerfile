# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files for workspaces
COPY package.json package-lock.json ./

# Copy packages that cron depends on
COPY packages/database ./packages/database

# Copy cron app
COPY apps/cron ./apps/cron

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npm run db:generate

# Build cron app
WORKDIR /app/apps/cron
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy packages
COPY packages/database ./packages/database

# Copy cron app
COPY apps/cron/package.json ./apps/cron/

# Install production dependencies
RUN npm ci --omit=dev

# Generate Prisma Client in production
RUN cd packages/database && npx prisma generate

# Copy built files from builder
COPY --from=builder /app/apps/cron/dist ./apps/cron/dist

WORKDIR /app/apps/cron

# Set environment
ENV NODE_ENV=production

# Default command
CMD ["node", "dist/index.js", "seed"]
