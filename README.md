# 🏎️ Maranello Luce Design System

<p align="center">
  <img src="docs/screenshots/hero-nero.png" alt="Maranello Luce Design — Nero Theme" width="800">
</p>

<p align="center">
  <strong>Ferrari Luce-inspired design system for AI agent dashboards and orchestration.</strong><br>
  Inspired by <a href="https://www.ferrari.com/it-IT/auto/ferrari-luce">Ferrari Luce</a> interior design language.<br>
  Part of <a href="https://github.com/Roberdan/MyConvergio">Convergio</a>.
  Aligned with the <a href="https://github.com/Roberdan/MyConvergio/blob/master/AgenticManifesto.md">Agentic Manifesto</a>.
</p>

<p align="center">
  <a href="https://roberdan.github.io/MaranelloLuceDesign/"><img src="https://img.shields.io/badge/🏎️_Live_Demo-GitHub_Pages-FFC72C?style=for-the-badge&logo=github" alt="Live Demo"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-3.2.0-FFC72C?style=flat-square">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square">
  <img src="https://img.shields.io/badge/tests-201_passed-00A651?style=flat-square">
  <img src="https://img.shields.io/badge/zero_deps-vanilla_TS-4EA8DE?style=flat-square">
</p>

---

## What's Inside

| Layer | Count |
|-------|-------|
| CSS tokens & components | 420+ tokens, 100+ component files |
| Web Components (`mn-*`) | 24 custom elements |
| Headless JS (charts, gauges, controls) | 150+ APIs |
| Icons (nav, status, platform, AI) | 149+ SVGs |
| Themes | 4 (nero, avorio, editorial, colorblind) |

## Install

```bash
npm install github:Roberdan/MaranelloLuceDesign#v3.2.0
```

Or CDN (no build):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.2.0/dist/css/index.css">
<script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.2.0/dist/iife/maranello.min.js"></script>
```

## Quick Example

```html
<body class="mn-nero">
  <div class="mn-section-dark">
    <div class="mn-container mn-grid-3">
      <div class="mn-stat">
        <span class="mn-stat__value">1,247</span>
        <span class="mn-stat__label">Active Users</span>
      </div>
      <mn-gauge value="72" label="CPU" max="100"></mn-gauge>
      <mn-chart type="donut" data='[{"label":"Done","value":80},{"label":"Todo","value":20}]'></mn-chart>
    </div>
  </div>
</body>
```

## For AI Agents

**→ [AGENT.md](AGENT.md)** — Complete API reference, CSS class catalog, decision tree, and copy-paste recipes. Optimized for LLM consumption.

## Rules & Governance

**→ [CONSTITUTION.md](CONSTITUTION.md)** — Binding design rules enforced by CI. Accessibility, theming, naming, icons.

## Live Demo

> **[▶ Open Full Demo](https://roberdan.github.io/MaranelloLuceDesign/)** — 30+ interactive sections, 150+ APIs, 4 themes

<p align="center">
  <a href="https://roberdan.github.io/MaranelloLuceDesign/">
    <img src="docs/screenshots/hero-nero.png" alt="Maranello Luce — Nero Theme Demo" width="720">
  </a>
</p>

The demo is self-documenting: every component shows its API usage inline.

## Development

```bash
npm run build        # Full build
npm run dev          # Demo at localhost:3000
npm run test:unit    # Vitest (201 tests)
npm run test:e2e     # Playwright
```

## Sponsor ❤️

Fictional demo data inspired by [Fightthestroke Foundation](https://www.fightthestroke.org/).
[🫶 Donate](https://www.fightthestroke.org/donorbox)

## License

[MIT](LICENSE) — (c) Roberdan 2026 — Roberto D'Angelo
