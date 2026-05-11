# ─────────────────────────────────────────────────────────────────────────────
# Build context MUST be the repo root so the shared prisma/ schema is available.
# From docker-compose: build: { context: .., dockerfile: backend/Dockerfile }
# ─────────────────────────────────────────────────────────────────────────────

# ─── Stage 1: install deps & compile ─────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /build

RUN apk add --no-cache libc6-compat

# Shared Prisma schema (lives one level above backend/)
COPY prisma ./prisma

# Backend package files
COPY backend/package.json backend/package-lock.json ./backend/
WORKDIR /build/backend
RUN npm ci --ignore-scripts

# Copy NestJS source
COPY backend/src        ./src
COPY backend/tsconfig.json \
     backend/tsconfig.build.json \
     backend/nest-cli.json ./

# Generate Prisma client using the shared schema
RUN npx prisma generate --schema=../prisma/schema.prisma

# Compile TypeScript → dist/
RUN npm run build

# ─── Stage 2: production runtime ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN apk add --no-cache curl && \
    addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nestjs

# Production node_modules (prune dev deps)
COPY --from=builder /build/backend/package.json ./
COPY --from=builder /build/backend/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# Compiled app + generated Prisma client
COPY --from=builder /build/backend/dist ./dist
COPY --from=builder /build/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /build/backend/node_modules/@prisma ./node_modules/@prisma

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -sf http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main.js"]
