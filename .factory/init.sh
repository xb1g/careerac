#!/bin/bash
set -e

cd /Users/bunyasit/dev/careerac

# Install dependencies (idempotent)
if [ ! -d "node_modules" ]; then
  pnpm install
else
  pnpm install --frozen-lockfile 2>/dev/null || pnpm install
fi

echo "Environment ready."
