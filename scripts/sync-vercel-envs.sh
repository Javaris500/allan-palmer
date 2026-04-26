#!/usr/bin/env bash
# Pushes the media + cron env keys from .env.local to Vercel
# Production + Preview environments. Idempotent: removes existing keys
# (silently ignores "not found"), then re-adds with the local value.
#
# Run from repo root:   bash scripts/sync-vercel-envs.sh

set -uo pipefail

KEYS=(
  BLOB_READ_WRITE_TOKEN
  MUX_TOKEN_ID
  MUX_TOKEN_SECRET
  MUX_WEBHOOK_SECRET
  CRON_SECRET
)

ENVIRONMENTS=(production preview)

# Pull a value out of .env.local — strips surrounding double-quotes.
get_env() {
  grep "^$1=" .env.local | head -1 | cut -d'=' -f2- | sed -E 's/^"(.*)"$/\1/'
}

if [[ ! -f .env.local ]]; then
  echo "No .env.local found in $(pwd). Aborting."
  exit 1
fi

for KEY in "${KEYS[@]}"; do
  VALUE="$(get_env "$KEY")"
  if [[ -z "$VALUE" ]]; then
    echo "[skip] $KEY is not set in .env.local"
    continue
  fi
  for ENV in "${ENVIRONMENTS[@]}"; do
    echo ""
    echo "── $KEY → $ENV ──────────────────────────────"
    # Remove if exists. The 'yes' makes vercel auto-confirm. Failures are
    # ignored — the key may simply not be there yet.
    yes y | vercel env rm "$KEY" "$ENV" 2>/dev/null || true
    # Add with our local value via stdin.
    printf '%s' "$VALUE" | vercel env add "$KEY" "$ENV"
  done
done

echo ""
echo "Done. To verify: vercel env ls"
