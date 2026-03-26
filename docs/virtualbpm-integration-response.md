# VirtualBPM — Maranello v5.0.0 Integration Response

**Da:** Maranello DS team
**A:** VirtualBPM team
**Data:** 21 marzo 2026

---

## 1. Bundle IIFE v5.0.0 — RETRO-COMPATIBILE

Tutte le API IIFE elencate nella spec sono presenti su `window.Maranello`:

| API | Status | Note |
|---|---|---|
| `sparkline`, `funnel`, `dataTable`, `flipCounter` | OK | Nessun cambio |
| `new FerrariGauge(canvas)` | OK | Nessun cambio |
| `setTheme`, `getTheme`, `cycleTheme`, `initThemeToggle` | OK | Nessun cambio |
| `toast`, `openModal`, `profileMenu` | OK | profileMenu ora supporta `type: 'theme-switcher'` (vedi punto 2) |
| `adminShell`, `settingsPanel`, `sectionCard` | OK | Nessun cambio |
| `createDetailPanel` | OK | Nessun cambio |
| `mapboxView` | OK | Anche `mapView` disponibile |
| `aiChat` | OK | In IIFE si chiama `Maranello.aiChat()`, NON `buildUI()` |
| `AppShellController`, `ViewRegistry`, `PanelOrchestrator` | OK | PanelOrchestrator ha nuovo 3rd param opzionale (backward-compat) |
| `StateScaffold` | OK | Nuovo stato `ready` aggiunto (vedi punto 3) |

**Risposta alla domanda critica:** NO, il bundle IIFE v5 NON aggiunge layout CSS o elementi DOM se non li istanziate. L'unico auto-mount e la FAB accessibilita (`<mn-a11y>`), che:
- Appare solo se non esiste gia nel DOM
- E un bottoncino fixed in basso a destra
- Per disabilitarlo: `Maranello._a11yCtrl?.destroy()`

I Web Components NON si auto-registrano nel bundle IIFE. Serve chiamare `registerAll()` esplicitamente.

---

## 2. Theme Switcher in Profile Menu — IMPLEMENTATO

Nuova sezione `type: 'theme-switcher'` nel profileMenu:

```js
Maranello.profileMenu(el, {
  name: 'Roberto D\'Angelo',
  email: 'roberdan@microsoft.com',
  avatarUrl: '/api/auth/photo',
  sections: [
    {
      title: 'Theme',
      type: 'theme-switcher'  // Renderizza 5 temi con preview Grafana-style
    },
    {
      title: 'Role',
      items: [{ label: 'Admin', action: fn }]
    },
    { divider: true },
    {
      items: [
        { label: 'Sign out', variant: 'danger', action: fn }
      ]
    }
  ]
});
```

Anche disponibile come standalone:

```js
// Standalone theme picker (fuori dal profile menu)
const picker = Maranello.themePicker(container, {
  current: 'nero',           // tema iniziale
  compact: true,             // per embedding in menu
  onChange: (theme) => {      // callback
    console.log('Theme changed to', theme);
  }
});

// Cleanup
picker.destroy();
```

Ogni tema mostra una card preview con: colore superficie, card simulata, dots per accent/error/info. Selezione via radio button, keyboard accessible.

---

## 3. StateScaffold API — CONFERMATA CON DIFFERENZE

L'API funziona in v5 IIFE. Una differenza dalla vostra spec:

```js
// CORRETTO — v5 API
var scaffold = new Maranello.StateScaffold(container, {
  state: 'loading',
  message: 'Loading portfolio data...',
  actionLabel: 'Retry',        // Label del bottone action
  onRetry: function() { ... }, // Callback per errori
  onAction: function() { ... } // Callback per empty/no-results
});

// Quando i dati arrivano:
scaffold.setState('ready');    // NUOVO in v5 — usa 'ready', non 'partial'

// Quando nessun dato:
scaffold.setState('empty', 'No engagements found');
// Il bottone action usa actionLabel + onAction dal constructor

// Quando errore:
scaffold.setState('error', 'API failed');
// Il bottone retry usa onRetry dal constructor
```

**Differenza dalla vostra spec:** `setState()` accetta `(state, message?)` dove message e una stringa. Le callback (`onRetry`, `onAction`) e il `actionLabel` si passano nel constructor, NON in `setState()`.

**6 stati disponibili:** `loading` | `ready` | `empty` | `error` | `partial` | `no-results`

---

## 4. FacetWorkbench — COMPATIBILE CON MAPPING

Si, FacetWorkbench puo sostituire i vostri dropdown. Mapping dei nomi:

```js
// Vostra spec → API Maranello v5
new Maranello.FacetWorkbench(el, {
  facets: [  // non 'schema'
    {
      id: 'studio',           // non 'key'
      label: 'Studio',
      type: 'select',         // 'select' | 'multi-select' | 'search' | 'date-range' | 'boolean'
      dataProvider: () => Promise.resolve([
        { value: 'All', label: 'All' },
        { value: 'EMEA 1', label: 'EMEA 1' },
        { value: 'EMEA 2', label: 'EMEA 2' }
      ])
    },
    {
      id: 'statuses',
      label: 'Status',
      type: 'multi-select',
      dataProvider: () => Promise.resolve([
        { value: 'Prospect', label: 'Prospect' },
        { value: 'Sprint', label: 'Sprint' }
      ])
    },
    {
      id: 'text',
      label: 'Search',
      type: 'search',
      dataProvider: () => Promise.resolve([])  // search non ha opzioni statiche
    },
    {
      id: 'fy',
      label: 'Fiscal Year',
      type: 'select',
      dataProvider: () => Promise.resolve([
        { value: 'FY25', label: 'FY25' },
        { value: 'FY26', label: 'FY26' }
      ])
    }
  ],
  onFilterChange: function(activeFilters) {  // non 'onChange'
    // activeFilters e una Map<string, string[]>
    activeFilters.forEach(function(values, key) {
      App.filters.set(key, values);
    });
  }
});
```

**Differenze chiave:**
- `facets` non `schema`
- `id` non `key`
- `onFilterChange` non `onChange` — ritorna `Map<string, string[]>`
- `options` sono async via `dataProvider: () => Promise<FacetOption[]>`
- I valori iniziali si settano chiamando metodi dopo il constructor

**Metodi utili:** `getActiveFilters()`, `clearAll()`, `clearFacet(id)`, `savePreset(name)`, `loadPreset(name)`

---

## 5. Navbar — NON ESISTE COME COMPONENTE

Maranello NON ha un componente navbar dedicato. Opzioni:

| Opzione | Come |
|---|---|
| **adminShell** | `Maranello.adminShell(el, { sidebar, topBar: true })` — include top bar + sidebar |
| **CSS utilities** | Usate le classi `.mn-nav`, `.mn-breadcrumb` con il vostro layout |
| **Custom** | Tenetevi la vostra navbar — Maranello CSS non interferisce (vedi punto 6) |

Raccomandazione: tenetevi la vostra navbar. Il CSS di Maranello non ha regole globali su `nav` che possano interferire.

---

## 6. CSS Conflitti — NESSUN RISCHIO

Maranello v5 usa `@layer` per tutto il CSS:

```css
@layer tokens, base, components, controls, forms, charts, layouts, extended, patterns, themes, utilities;
```

**Verificato:**
- Nessuna regola su `#slot-left`, `#slot-right`, `#grid`, `#navbar`
- Nessuna regola globale su `nav { }` (solo `.mn-nav`, `.mn-section-nav`)
- Nessuna regola su `[hidden]` globale (solo `.mn-layout__sidebar[hidden]`)
- Tutti i componenti usano prefisso `.mn-*`
- `body` reset in `@layer base` — override facile

**Il vostro setup funziona:**
```
maranello.min.css (in @layer)  ← bassa specificita
app-layout.css (fuori @layer)  ← vince sempre
```

CSS fuori da `@layer` ha sempre precedenza su CSS dentro `@layer`. Il vostro layout non sara mai sovrascritto.

---

## 7. Breaking Changes v4.20.0 → v5.0.0 per IIFE

| Cambio | Impatto su VirtualBPM | Azione |
|---|---|---|
| [BC-1] StateScaffold: nuovo stato `ready` | **Nessuno** — stato aggiuntivo, `partial` funziona ancora | Usate `ready` per successo, `partial` per degraded |
| [BC-2] PanelOrchestrator: 3rd param opzionale | **Nessuno** — non lo usate | Nessuna |
| [BC-3] CSS index.css piu completo | **Nessuno** — usate maranello.min.css | Nessuna |
| [BC-4] Sugar !important ridotto 128→9 | **Basso** — solo se override Sugar specificity | Verificate tema Sugar visivamente |
| `profileMenu` supporta `type: 'theme-switcher'` | **Nessuno** — additive | Opzionale |
| `themePicker` nuova funzione | **Nessuno** — additive | Opzionale |
| IIFE bundle 434KB (era ~400KB) | **Minimo** — +34KB | Nessuna |

**Nessuna funzione rinominata o rimossa.** Nessun parametro cambiato per le API che usate. Nessun CSS class name cambiato.

**Web Components:** Il bundle IIFE NON auto-registra WC. `<mn-a11y>` FAB si auto-monta (come in v4). Per rimuoverlo: `Maranello._a11yCtrl?.destroy()`.

---

## Riepilogo

| # | Richiesta | Risposta |
|---|---|---|
| 1 | IIFE retro-compat | OK — tutte le API presenti, nessun breaking change |
| 2 | Theme in profileMenu | IMPLEMENTATO — `type: 'theme-switcher'` + standalone `themePicker()` |
| 3 | StateScaffold API | OK con differenza — actions nel constructor, non in setState() |
| 4 | FacetWorkbench | COMPATIBILE — mapping nomi necessario (id/facets/onFilterChange) |
| 5 | Navbar | NON ESISTE — usate la vostra, nessun conflitto |
| 6 | CSS conflitti | NESSUNO — @layer + prefisso .mn-* |
| 7 | Breaking changes | NESSUNO che impatti VirtualBPM |

Migration guide completa: [docs/migrations/v5.0.0.md](migrations/v5.0.0.md)
