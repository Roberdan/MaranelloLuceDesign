<!-- v3.1.0 | 2025-07-21 -->
# Data Contracts

All types importable from `maranello-luce-design-business`. Peer dep: `mapbox-gl` (optional, for MapView).

## Interface Summary

| Interface | Component | Key Fields |
|---|---|---|
| `GanttTask` | `gantt()` | `id`, `title`, `start` (ISO), `end` (ISO), `children?` |
| `DataTableOptions<T>` | `dataTable()` | `columns[]`, `data[]`, `pageSize`, `groupBy`, `selectable`, `onRowClick` |
| `GaugeConfig` | `FerrariGauge` | `value`, `min`, `max`, `label`, `unit`, `size`, `ticks`, `redline` |
| `SpeedometerOptions` | `speedometer()` | `value`, `max`, `unit`, `size`, `ticks[]`, `animate` |
| `DonutSegment` | `donut()` | `value`, `color` |
| `AreaDataset` | `areaChart()` | `data: number[]`, `color?` |
| `RadarDataItem` | `radar()` | `label`, `value` |
| `BubbleDataItem` | `bubble()` | `x`, `y`, `z?`, `label?`, `color?` |
| `BarDataItem` | `barChart()` | `value`, `label?`, `color?` |
| `HBarChartOptions` | `hBarChart()` | `title`, `bars[]`, `unit`, `maxValue` |
| `MapMarker` | `mapView()` | `id`, `lat`, `lon`, `label`, `detail?`, `size?`, `color?`, `count?` |
| `SankeyData` | `funnel()` | `pipeline[]` (`label`,`count`,`color`), `total?`, `onHold?`, `withdrawn?` |
| `DetailPanelOptions` | `openDetailPanel()` | `title`, `schema[]` (sections/tabs/fields), `data`, `editable`, `onSave`, `onClose` |
| `OkrPanelOptions` | `okrPanel()` | `title`, `period`, `objectives[]` (scope, progress, keyResults) |
| `LoginScreenOptions` | `loginScreen()` | `healthUrl`, `title`, `subtitle` |
| `AIChatOptions` | `buildUI()` | `title`, `welcomeMessage`, `avatar`, `quickActions` |
| `ProfileMenuOptions` | `profileMenu()` | `name`, `email`, `avatarUrl`, `sections[]` |
| `SystemStatusOptions` | `systemStatus()` | `services[]`, `pollInterval`, `version`, `environment` |
| `DatePickerOptions` | `datePicker()` | `value`, `min`, `max`, `disabledDates` |
| `FlipCounterOptions` | `flipCounter()` | `value`, `digits?`, `duration?` |
| `ProgressRingOptions` | `progressRing()` | `value`, `max`, `size`, `color` |
| `ToastOptions` | `toast()` | `title`, `message`, `type` (`success`\|`error`\|`warning`\|`info`), `duration` |
| `FormValidators` | `initForms()` | `required`, `email`, `minLength`, `pattern`, custom validators |

## Column Type Options (DataTable)

| `type` | Rendering |
|---|---|
| `text` | Plain string |
| `number` | Right-aligned, formatted |
| `date` | Formatted date |
| `status` | Color-coded badge |
| `badge` | Pill badge |
| `custom` | Uses `render(value, row)` callback |

## DetailPanel Field Types

| `type` | Behavior |
|---|---|
| `text` | Text input |
| `number` | Number input |
| `date` | Date picker |
| `select` | Dropdown with `options[]` |
| `status` | Color-coded status selector |
| `person` | Autocomplete person search |
| `score` | Numeric score (0-100) |
| `textarea` | Multi-line text |

## Ferrari Controls (shared interface)

```ts
{ positions?: string[], initial?: number, label?: string, onChange?: (index: number) => void }
```

| Function | Example positions |
|---|---|
| `manettino()` | `['WET', 'SPORT', 'RACE']` |
| `steppedRotary()` | `['0', '1', '2', 'A']` |
| `cruiseLever()` | `['OFF', 'SET', 'RES']` |
| `toggleLever()` | boolean — uses `initial: false`, `onChange: (on) => {}` |

## Chart Signatures

```ts
sparkline(canvas, number[], opts?)
donut(canvas, DonutSegment[])
barChart(canvas, BarDataItem[])
areaChart(canvas, AreaDataset[])
liveGraph(canvas, LiveGraphOptions)
halfGauge(canvas, HalfGaugeOptions)
progressRing(container, ProgressRingOptions)
flipCounter(container, FlipCounterOptions)
radar(canvas, RadarDataItem[])
bubble(canvas, BubbleDataItem[])
hBarChart(selector, HBarChartOptions)
```

## Gantt Controller

```ts
const ctrl = gantt(container, GanttTask[], opts?);
ctrl.expandAll(); ctrl.collapseAll(); ctrl.scrollToToday(); ctrl.setZoom(n);
```

## Data Binding

```ts
emit(event, data)          // fire event
on(event, callback)        // listen
off(event, callback)       // unlisten
bind(selector, event, key) // auto-bind DOM
bindChart(canvas, type, { url, map, interval })
updateGauge(selector, value)
```
