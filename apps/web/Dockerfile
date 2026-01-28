# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files for workspaces
COPY package.json package-lock.json ./

# Copy packages that web depends on
COPY packages/database ./packages/database
COPY packages/shared ./packages/shared

# Copy web app
COPY apps/web ./apps/web

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npm run db:generate

# Build web app
WORKDIR /app/apps/web
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER nextjs

CMD ["node", "apps/web/server.js"]