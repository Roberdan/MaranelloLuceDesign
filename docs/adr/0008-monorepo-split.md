# ADR-0008: Monorepo Split — @convergio/design-tokens + @convergio/design-elements

**Date:** 2026-03-27
**Status:** Accepted
**Version:** 6.0.0
**Reference:** ADR-0117 (ConvergioPlatform)

## Context

Convergio UI needs Maranello as npm packages for Next.js integration. The monolite bundles viz components with framework-level primitives (routing, shell, state management) that conflict with Next.js App Router.

## Decision

Split into `@convergio/design-tokens` (design tokens + theme system) and `@convergio/design-elements` (31 WC + headless viz/domain API). Kill Presentation Runtime. Add shadcn/ui token bridge.

## Consequences

- Consumers install two packages instead of one
- Framework-level features (routing, auth, state) delegated to Next.js/SvelteKit
- shadcn/ui primitives replace Maranello CSS-only primitives (buttons, inputs, dialogs)
- Per-element tree-shaking reduces bundle size for consumers using few components
