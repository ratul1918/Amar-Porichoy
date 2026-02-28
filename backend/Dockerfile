# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Builder
# Compiles TypeScript, installs ALL dependencies (including dev)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install OS-level build tools needed by native addons (bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy manifests first for better layer caching
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install all deps (dev included for build tools)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript → dist/
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Runtime
# Production image: stripped of dev tooling, non-root user
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Security: run as non-root
RUN addgroup --system porichoy && adduser --system --ingroup porichoy porichoy

# Install OS-level runtime libs only (bcrypt needs these)
RUN apk add --no-cache libstdc++ dumb-init

WORKDIR /app

# Copy manifests
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Production-only dependencies
RUN npm ci --omit=dev && npx prisma generate

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist/

# Set file ownership
RUN chown -R porichoy:porichoy /app

USER porichoy

# Health-check: hit /health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-3001}/health || exit 1

EXPOSE 3001

# dumb-init handles PID 1 signal propagation correctly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]
