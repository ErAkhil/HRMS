#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy.sh — zero-downtime deploy for PM2-based VPS deployment
#
# Usage:
#   ./scripts/deploy.sh          # deploy both services
#   ./scripts/deploy.sh api      # rebuild + reload NestJS only
#   ./scripts/deploy.sh web      # rebuild + reload Next.js only
#
# Prerequisites on the server:
#   node 20+, npm, pm2 (npm i -g pm2), nginx
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

TARGET="${1:-all}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"

echo "▶  Unikove deploy — target: $TARGET"
echo "   Root: $REPO_ROOT"

mkdir -p "$LOG_DIR"
cd "$REPO_ROOT"

# ─── 1. Pull latest code ─────────────────────────────────────────────────────
echo "▶  Pulling latest code..."
git pull --ff-only

# ─── 2. API (NestJS) ─────────────────────────────────────────────────────────
deploy_api() {
  echo "▶  Building NestJS API..."
  cd "$REPO_ROOT/backend"
  npm ci --omit=dev
  npm run prisma:generate
  npm run build
  cd "$REPO_ROOT"

  echo "▶  Reloading unikove-api via PM2..."
  pm2 reload ecosystem.config.js --only unikove-api --env production
  pm2 save
}

# ─── 3. Web (Next.js) ────────────────────────────────────────────────────────
deploy_web() {
  echo "▶  Building Next.js..."
  cd "$REPO_ROOT/frontend"
  npm ci --omit=dev
  npm run build

  echo "▶  Reloading unikove-web via PM2..."
  cd "$REPO_ROOT"
  pm2 reload ecosystem.config.js --only unikove-web --env production
  pm2 save
}

# ─── Dispatch ────────────────────────────────────────────────────────────────
case "$TARGET" in
  api)  deploy_api  ;;
  web)  deploy_web  ;;
  all)
    deploy_api
    deploy_web
    ;;
  *)
    echo "Unknown target: $TARGET (use api | web | all)"
    exit 1
    ;;
esac

echo "✓  Deploy complete. PM2 status:"
pm2 list
