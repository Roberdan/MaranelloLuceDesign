#!/usr/bin/env bash
# check-migration-docs.sh
# CI gate: if CHANGELOG has a "Breaking Changes" section in the latest version entry,
# a corresponding docs/migrations/vX.Y.Z.md must exist.
set -euo pipefail

VERSION=$(node -p "require('./package.json').version" 2>/dev/null)
CHANGELOG="CHANGELOG.md"
MIGRATION_DOC="docs/migrations/v${VERSION}.md"

if [ ! -f "$CHANGELOG" ]; then
  echo "SKIP: No CHANGELOG.md found."
  exit 0
fi

# Extract the block for the current version from CHANGELOG using escaped version pattern
ESCAPED="${VERSION//./\\.}"
VERSION_BLOCK=$(awk "/^## \[${ESCAPED}\]/{found=1; next} found && /^## \[/{exit} found{print}" "$CHANGELOG")

if [ -z "$VERSION_BLOCK" ]; then
  echo "SKIP: Version ${VERSION} not found in CHANGELOG.md."
  exit 0
fi

# Check if the version block has a "### Breaking Changes" heading
if echo "$VERSION_BLOCK" | grep -q "^### Breaking"; then
  if [ ! -f "$MIGRATION_DOC" ]; then
    echo ""
    echo "FAIL: CHANGELOG v${VERSION} contains breaking changes but migration doc is missing."
    echo "      Expected: ${MIGRATION_DOC}"
    echo ""
    echo "      Copy docs/migrations/TEMPLATE.md, fill it in, and commit before releasing."
    echo ""
    exit 1
  fi
  echo "OK: Migration doc found for v${VERSION} with breaking changes: ${MIGRATION_DOC}"
else
  echo "OK: No breaking changes declared in v${VERSION} — migration doc not required."
fi
