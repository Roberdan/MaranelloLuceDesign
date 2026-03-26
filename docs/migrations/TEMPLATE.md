<!-- migrations/TEMPLATE.md — copy this for every release with breaking changes -->
# Migration Guide — vX.Y.Z

> **Severity:** PATCH | MINOR | MAJOR
> **Affects:** CSS tokens | JS APIs | Web Components | Themes | Visual appearance
> **Migration effort:** Low (search-replace) | Medium (component changes) | High (architectural)

## Summary

One paragraph. What changed, why it changed (WCAG fix / design decision / API cleanup), and
who is affected (everyone / Avorio users / consumers of JS API X).

---

## Breaking Changes

### [BC-1] Short descriptive title

**Why it changed:** One sentence — the root cause (e.g. "Failed WCAG AA contrast at 2.65:1").
**Who is affected:** Anyone using `<class or token or API>` directly.

**Before (vX.Y.Z-1):**
```css
/* or ts / html — show old usage */
.my-component { color: var(--old-token); }
```

**After (vX.Y.Z):**
```css
.my-component { color: var(--new-token); }
```

**Migrate:**
1. Replace `--old-token` with `--new-token` everywhere in your CSS.
2. If you hardcoded `#HEXVAL`, switch to the semantic token.

---

### [BC-2] Another breaking change

…

---

## Non-Breaking Changes

List notable additions or deprecations that are safe to adopt gradually.

- `--mn-new-token` added — semantic alias for X, use it in new code.
- `OldApi()` deprecated — still works, will be removed in vX+1.0.0. Replace with `NewApi()`.

---

## Automated Migration (if available)

```bash
# sed / jscodeshift / ast-grep commands to automate the migration
find src -name '*.css' | xargs sed -i 's/--old-token/--new-token/g'
```

---

## Verification

After migrating, run:
```bash
npm run build && npm run test:unit
# visually check all 5 themes: nero, avorio, editorial, colorblind, sugar
```

---

## Rollback

If you cannot migrate yet, pin to the previous version:
```bash
npm install github:Roberdan/convergio-design#vX.Y.Z-1
```
