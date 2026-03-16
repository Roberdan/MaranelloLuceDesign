<!-- v4.11.0 | 2026-03-16 -->
# Data Contracts

All types importable from `maranello-luce-design-business`. Peer dep: `mapbox-gl` (optional, for MapView).
Full API detail for v4.11.0 components: [`docs/api-contracts-v4.md`](docs/api-contracts-v4.md).

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
| `UserTableOptions` | `userTable()` | `searchable`, `selectable`, `onSelect`, `onAction`, `pageSize` |
| `AuditLogOptions` | `auditLog()` | `maxEntries`, `filterable`, `onSelect`, `live` |
| `AgentCostBreakdownOptions` | `agentCostBreakdown()` | `currency`, `period`, `onSelect`, `onBudgetAlert`, `sortable` |
| `CostTimelineOptions` | `costTimeline()` | `labels`, `series[]`, `stacked`, `unit`, `onHover` |
| `BusinessModelCanvasOptions` | `businessModelCanvas()` | `blocks?`, `editable`, `onChange` |
| `AgentTraceOptions` | `agentTrace()` | `maxVisible`, `onSelect` |
| `TokenMeterOptions` | `tokenMeter()` | `label`, `showCost`, `showBreakdown`, `animate`, `onChange` |
| `StreamingTextOptions` | `streamingText()` | `onCitationClick`, `onDone`, `typingCursor`, `processMarkdown` |
| `RiskMatrixOptions` | `riskMatrix()` | `items[]`, `gridSize`, `onHover`, `onClick`, `animate` |
| `KpiScorecardOptions` | `kpiScorecard()` | `currency`, `onSelect`, `animate` |
| `CohortGridOptions` | `cohortGrid()` | `periodLabels`, `showAbsolute`, `onHover`, `colorHigh`, `colorLow` |
| `ApprovalChainOptions` | `approvalChain()` | `onAction`, `editable`, `orientation` |
| `BCGMatrixOptions` | `bcgMatrix()` | `items[]`, `shareThreshold`, `growthThreshold`, `onHover`, `onClick` |
| `NineBoxMatrixOptions` | `nineBoxMatrix()` | `items[]`, `xLabel`, `yLabel`, `onSelect`, `onMove` |
| `SwotMatrixOptions` | `swotMatrix()` | `items?`, `editable`, `onChange`, `quadrantLabels` |
| `DecisionMatrixOptions` | `decisionMatrix()` | `criteria[]`, `alternatives[]`, `editable`, `onChange` |
| `WaterfallChartOptions` | `waterfallChart()` | `segments[]`, `unit`, `animate`, `height` |
| `ConfidenceChartOptions` | `confidenceChart()` | `labels`, `values`, `lower`, `upper`, `color`, `animate` |
| `DateRangePickerOptions` | `dateRangePicker()` | `value?`, `min`, `max`, `placeholder`, `onChange` |
| `ActivityFeedOptions` | `activityFeed()` | `maxItems`, `animate` |
| `BulletChartOptions` | `bulletChart()` | `value`, `target`, `max`, `label`, `unit`, `ranges?` |
| `NotificationCenterOptions` | `notificationCenter()` | `maxVisible`, `onAction`, `position` |

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
waterfallChart(canvas, WaterfallChartOptions)
confidenceChart(canvas, ConfidenceChartOptions)
bulletChart(canvas, BulletChartOptions)
costTimeline(canvas, CostTimelineOptions)
riskMatrix(canvas, RiskMatrixOptions)
bcgMatrix(canvas, BCGMatrixOptions)
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
