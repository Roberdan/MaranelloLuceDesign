#!/bin/bash
set -euo pipefail
# check-theme-semantics.sh — Prevent var(--bianco-caldo) as text color in unscoped CSS
# and demo JS inline styles. Invisible on Avorio (light) theme.
# Use var(--mn-text) / var(--mn-text-muted) for adaptive text colors. v1.3.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
errors=0

CSS_SKIP="themes-|utilities|base\.css|extended-toast|extended-tooltip|tokens"

echo "Checking CSS: unscoped var(--bianco-caldo) as text color..."
while IFS= read -r match; do
  file="${match%%:*}"; line="${match#*:*:}"
  if echo "$file" | grep -qE "$CSS_SKIP"; then continue; fi
  if echo "$line" | grep -qE "body\.mn-|\.mn-avorio|\.mn-nero|\.mn-colorblind|\.mn-section-|intentional:|grigio-scuro|ghost-light"; then continue; fi
  echo "  FAIL: $file  line $(echo "$match" | cut -d: -f2)"
  echo "        $line"
  echo "  Fix : Replace with var(--mn-text)"
  ((errors++)) || true
done < <(grep -rn "[^-]color[[:space:]]*:[[:space:]]*var(--bianco-caldo" "$ROOT/packages/elements/src/css/" 2>/dev/null || true)

echo "Checking demo JS/HTML: inline var(--bianco-caldo) as text color..."
# Exclude generated bundles (*.bundle.js), test pages, and glass-test
while IFS= read -r match; do
  file="${match%%:*}"; line="${match#*:*:}"
  if echo "$file" | grep -qE "bundle\.js|glass-test|responsive\.html|e2e\.html|tokens\.js"; then continue; fi
  if echo "$line" | grep -qE "intentional|swatch\(|grigio-scuro|background:var(--bianco-caldo)|mn-section-dark|mn-section-"; then continue; fi
  echo "  FAIL: $file  line $(echo "$match" | cut -d: -f2)"
  echo "        $(echo "$line" | cut -c1-120)"
  echo "  Fix : Replace with var(--mn-text)"
  ((errors++)) || true
done < <(grep -rn "color[[:space:]]*:[[:space:]]*var(--bianco-caldo" "$ROOT/demo/" 2>/dev/null || true)

echo "Checking CSS: var(--mn-text-inverse) as text color in Avorio overrides..."
while IFS= read -r match; do
  file="${match%%:*}"; line="${match#*:*:}"
  # Allow intentional uses: on accent/error bg, dark section scoped, or form step active (accent bg)
  if echo "$line" | grep -qE "intentional|mn-section-dark|mn-accent-text|mn-form-step--active"; then continue; fi
  echo "  FAIL: $file  line $(echo "$match" | cut -d: -f2)"
  echo "        $line"
  echo "  Fix : Replace color: var(--mn-text-inverse) with var(--mn-text) in Avorio overrides"
  ((errors++)) || true
done < <(grep -rn 'mn-avorio.*color.*var(--mn-text-inverse)' "$ROOT/packages/elements/src/css/" 2>/dev/null || true)

echo ""
if [[ $errors -gt 0 ]]; then
  echo "FAIL: $errors theme-semantic violations. Text invisible on light/Avorio theme."
  echo "Use var(--mn-text) / var(--mn-text-muted) for adaptive text colors."
  exit 1
else
  echo "OK: No theme-semantic violations."
  exit 0
fi
