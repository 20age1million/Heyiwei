# ============================================================
# Multi-stage Dockerfile template for static frontends (SPA)
# Build with Node → serve via NGINX
#
# Usage:
#   docker build -t ghcr.io/<org>/<repo>:<tag> \
#     --build-arg VITE_BASE=/ \
#     .
#
# Make sure you also have a proper .dockerignore (node_modules, dist, etc.)
# ============================================================

########## 1) Build stage #####################################################
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency manifests and install (cache npm store between builds)
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy all project files (index.html, src/, custom nginx.conf, etc.)
COPY . .

# Build TypeScript -> JS and stage static assets the way the app expects:
#   - index.html at project root
#   - plain browser script main.js next to it
RUN mkdir -p dist \
  && cp index.html dist/index.html \
  && npx tsc src/main.ts --target ES2015 --lib ES2015,DOM --outDir dist \
  && mv dist/src/main.js dist/main.js \
  && rm -rf dist/src


########## 2) Runtime stage (static file server) ##############################
FROM nginx:1.27-alpine

# [CHANGE ME] Provide an NGINX config that:
#   - Serves your SPA files from /usr/share/nginx/html
#   - Returns index.html for unknown routes (history fallback)
#   - Exposes a simple /healthz endpoint (or adjust HEALTHCHECK below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# [OPTIONAL] Run as non-root (hardened)
# Note: NGINX official image uses user 101:101 in some variants; verify paths/ports.
# USER 101:101

EXPOSE 80

# Health check
# By default, checks /healthz. Your nginx.conf should return 200 "ok" on /healthz.
# [CHANGE ME] If you don't have /healthz, switch to "/" or an asset path that exists,
# and/or swap wget → curl -f (alpine curl is in curl package).
# Also: yes, this runs every 30s with a 3s timeout and 3 retries before unhealthy.
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1

# ----------------------- Notes for Other Repos -------------------------------
# - Node version:    [CHANGE ME] pin to the version your repo supports (e.g., node:22-alpine).
# - Package manager: [CHANGE ME] npm → pnpm/yarn with matching install/build commands.
# - Build output:    [CHANGE ME] if your framework outputs to ".next/out", "build", "public", etc.
# - Env vars:        [CHANGE ME] add ARG/ENV for anything your build needs (API base, base path).
# - NGINX config:    [CHANGE ME] ensure SPA fallback and /healthz route exist as expected.
# - Non-root:        [OPTIONAL] enable USER + fix permissions/ports if your environment requires it.
# - Caching:         Requires BuildKit for --mount cache;
