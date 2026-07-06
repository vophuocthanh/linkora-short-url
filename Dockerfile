# =============================================================================
# Stage 1 — Install dependencies & build
# =============================================================================
FROM node:20-alpine AS builder

ARG DATABASE_URL
ARG AUTH_SECRET

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_SECRET=$AUTH_SECRET

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy lockfile & manifests first (cached layer)
COPY pnpm-lock.yaml package.json ./
RUN pnpm fetch

# Copy the rest of the source
COPY . .

# Install dependencies (offline from fetch cache)
RUN pnpm install --frozen-lockfile --offline

# Generate Prisma client
RUN pnpm prisma generate

# Build Next.js
RUN pnpm build

# Prune dev dependencies after build
RUN pnpm prune --prod

# =============================================================================
# Stage 2 — Production runtime
# =============================================================================
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3002

WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy standalone output from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder /app/public ./public

# Copy Prisma schema & generated client so migrations can run
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm

# Ensure correct ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3002

CMD ["node", "server.js"]
