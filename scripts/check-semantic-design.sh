#!/bin/bash
# check-semantic-design.sh — Semantic Design Audit CI gate
# Runs contrast checks + signal/danger-button semantic checks.
# Exits 1 on any P0 finding (meaning lost) or WCAG AA contrast failure.
# Full visual audit (Phase 2-4) runs separately / nightly, not on push.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Semantic Design Audit ==="
echo ""

EXIT_CODE=0

echo "Phase 1 — WCAG AA contrast ratios..."
if node "$SCRIPT_DIR/check-contrast.mjs"; then
  echo "OK: Contrast ratios pass"
else
  echo "FAIL: Contrast ratio violations found"
  EXIT_CODE=1
fi
echo ""

echo "Phase 2 — Signal token distinctness + danger-button semantics..."
if node "$SCRIPT_DIR/check-signal-semantics.mjs"; then
  echo "OK: Signal semantics pass"
else
  echo "FAIL: Semantic signal violations found (see JSON above)"
  EXIT_CODE=1
fi
echo ""

if [ "$EXIT_CODE" -eq 0 ]; then
  echo "=== Semantic Design Audit PASSED ==="
else
  echo "=== Semantic Design Audit FAILED — fix P0 issues before merge ==="
fi

exit "$EXIT_CODE"
