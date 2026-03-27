#!/bin/bash
set -euo pipefail
# check-tokens.sh — Verify TS string refs to CSS vars match actual token definitions
# Version: 1.1.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CSS_DIR="$ROOT/packages/elements/src/css"
TS_DIR="$ROOT/src/ts"
errors=0

# Extract all CSS custom property names (both definitions and var() references)
css_tokens=$(grep -roh '\-\-[a-zA-Z0-9_-]\+' "$CSS_DIR" | sort -u)

# Extract all TS string references to CSS vars ('--xxx' or "--xxx" or `--xxx`)
ts_refs=$(grep -roh "'\-\-[a-zA-Z0-9_-]\+'" "$TS_DIR" 2>/dev/null | tr -d "'" | sort -u || true)
ts_refs2=$(grep -roh '"\-\-[a-zA-Z0-9_-]\+"' "$TS_DIR" 2>/dev/null | tr -d '"' | sort -u || true)
ts_refs3=$(grep -roh '`\-\-[a-zA-Z0-9_-]\+`' "$TS_DIR" 2>/dev/null | tr -d '`' | sort -u || true)

all_ts_refs=$(printf '%s\n%s\n%s' "$ts_refs" "$ts_refs2" "$ts_refs3" | sort -u | grep -v '^$' || true)

if [[ -z "$all_ts_refs" ]]; then
  echo "OK: No TS token references found (nothing to check)"
  exit 0
fi

echo "CSS tokens defined: $(echo "$css_tokens" | wc -l | tr -d ' ')"
echo "TS token references: $(echo "$all_ts_refs" | wc -l | tr -d ' ')"
echo ""

# Check each TS reference exists in CSS (use grep -F for fixed string, -- to end options)
while IFS= read -r ref; do
  if ! echo "$css_tokens" | grep -qFx -- "$ref"; then
    echo "MISMATCH: TS references '$ref' but no CSS definition found"
    ((errors++)) || true
  fi
done <<< "$all_ts_refs"

if [[ $errors -gt 0 ]]; then
  echo ""
  echo "FAIL: $errors TS-to-CSS token mismatches"
  exit 1
else
  echo "OK: All TS token references match CSS definitions"
  exit 0
fi
