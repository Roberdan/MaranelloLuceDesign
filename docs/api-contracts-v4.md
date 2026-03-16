<!-- v4.11.0 | 2026-03-16 — 22 new component API contracts -->
# API Contracts — v4.11.0 Components

## userTable (src/ts/user-table.ts)

```ts
function userTable(el: HTMLElement, users: AdminUser[], opts?: UserTableOptions): UserTableController
```

**AdminUser**: `id`, `name`, `email`, `role: UserRole`, `status: UserStatus`, `lastActive?`, `avatarUrl?`, `teams?`
**UserRole**: `'admin' | 'member' | 'viewer' | 'billing'`
**UserStatus**: `'active' | 'inactive' | 'suspended' | 'invited'`
**UserTableOptions**: `searchable?`, `selectable?`, `onSelect?(user)`, `onAction?(user, action)`, `pageSize?`
**Controller**: `update(users)`, `setFilter(query)`, `getSelected()`, `destroy()`
**CSS**: `mn-user-table` prefix. Actions: `edit | suspend | delete | resend-invite`.

## auditLog (src/ts/audit-log.ts)

```ts
function auditLog(el: HTMLElement, entries?: AuditEntry[], opts?: AuditLogOptions): AuditLogController
```

**AuditEntry**: `id`, `timestamp`, `actor`, `actorRole?`, `action`, `resource?`, `severity: AuditSeverity`, `metadata?`, `ipAddress?`
**AuditSeverity**: `'info' | 'warning' | 'error' | 'critical' | 'success'`
**AuditLogOptions**: `maxEntries?` (default 100), `filterable?`, `onSelect?`, `live?`
**Controller**: `prepend(entry)`, `append(entry)`, `setFilter(severity | 'all')`, `clear()`, `destroy()`
**CSS**: `mn-audit` prefix. ARIA: `role="log"`, expandable entries, live region.

## agentCostBreakdown (src/ts/agent-cost-breakdown.ts)

```ts
function agentCostBreakdown(el: HTMLElement, rows: AgentCostRow[], opts?: AgentCostBreakdownOptions): AgentCostBreakdownController
```

**AgentCostRow**: `id`, `agentName`, `model`, `totalTokens`, `cachedTokens?`, `cost`, `costDelta?`, `calls`, `avgLatencyMs?`, `budget?`, `tags?`
**Options**: `currency?` (USD), `period?`, `onSelect?`, `onBudgetAlert?`, `sortable?`
**Controller**: `update(rows)`, `destroy()`
**CSS**: `mn-cost-breakdown` prefix. Fires budget alert when cost > 80% of budget.

## costTimeline (src/ts/charts-cost-timeline.ts)

```ts
function costTimeline(canvas: HTMLCanvasElement, opts: CostTimelineOptions): CostTimelineController
```

**CostSeries**: `id`, `label`, `color?`, `values: number[]`
**Options**: `labels: string[]`, `series: CostSeries[]`, `height?`, `stacked?`, `animate?`, `unit?` ($), `onHover?`
**Controller**: `update(partial)`, `destroy()`
**A11y**: sr-only data table with period rows and series columns.

## businessModelCanvas (src/ts/business-model-canvas.ts)

```ts
function businessModelCanvas(el: HTMLElement, opts?: BusinessModelCanvasOptions): BusinessModelCanvasController
```

**BmcBlockId**: 9 Osterwalder blocks (`key-partners`, `key-activities`, `value-proposition`, etc.)
**BmcItem**: `id`, `text`, `blockId: BmcBlockId`
**Options**: `blocks?`, `editable?` (default true), `onChange?`
**Controller**: `getBlocks()`, `addItem(blockId, text)`, `removeItem(id)`, `update(blocks)`, `destroy()`
**CSS**: `mn-bmc` prefix. CSS grid layout matching Osterwalder 9-block.

## agentTrace (src/ts/agent-trace.ts)

```ts
function agentTrace(el: HTMLElement, steps?: TraceStep[], opts?: AgentTraceOptions): AgentTraceController
```

**TraceStep**: `id`, `kind: TraceStepKind`, `label`, `status: TraceStepStatus`, `durationMs?`, `input?`, `output?`, `timestamp?`
**TraceStepKind**: `'tool' | 'reasoning' | 'result' | 'handoff'`
**TraceStepStatus**: `'pending' | 'running' | 'done' | 'error'`
**Options**: `maxVisible?`, `onSelect?`
**Controller**: `add(step)`, `update(id, partial)`, `clear()`, `destroy()`
**CSS**: `mn-agent-trace` prefix. Expandable steps with input/output detail.

## tokenMeter (src/ts/token-meter.ts)

```ts
function tokenMeter(el: HTMLElement, usage?: TokenUsage, opts?: TokenMeterOptions): TokenMeterController
```

**TokenUsage**: `prompt`, `completion`, `cached?`, `budget?`, `costPerMToken?`
**Options**: `label?`, `showCost?`, `showBreakdown?`, `animate?`, `onChange?`
**Controller**: `update(usage)`, `reset()`, `destroy()`
**CSS**: `mn-token-meter` prefix. ARIA: `role="meter"` on bar.

## streamingText (src/ts/streaming-text.ts)

```ts
function streamingText(el: HTMLElement, opts?: StreamingTextOptions): StreamingTextController
```

**Options**: `onCitationClick?`, `onDone?`, `typingCursor?` (true), `processMarkdown?` (true)
**Controller**: `append(chunk)`, `done()`, `reset()`, `setText(text)`, `destroy()`
**CSS**: `mn-stream` prefix. Markdown-lite: bold `**text**`, inline `` `code` ``, citations `[N]`.
**A11y**: `role="log"`, `aria-live="polite"`, sr-only live region.

## riskMatrix (src/ts/charts-risk-matrix.ts)

```ts
function riskMatrix(canvas: HTMLCanvasElement, opts: RiskMatrixOptions): RiskMatrixController | undefined
```

**RiskItem**: `id`, `label`, `probability: 1-5`, `impact: 1-5`, `color?`
**Options**: `items[]`, `height?`, `gridSize?`, `animate?`, `onHover?`, `onClick?`
**Controller**: `update(items)`, `destroy()`
**A11y**: sr-only data table with risk level per item.

## kpiScorecard (src/ts/kpi-scorecard.ts)

```ts
function kpiScorecard(el: HTMLElement, rows: KpiRow[], opts?: KpiScorecardOptions): KpiScorecardController
```

**KpiRow**: `id`, `label`, `unit?`, `target`, `actual`, `trend?: number[]`, `status?: KpiStatus`, `format?`
**KpiStatus**: `'green' | 'yellow' | 'red' | 'neutral'`
**Options**: `currency?`, `onSelect?`, `animate?`
**Controller**: `update(rows)`, `destroy()`
**CSS**: `mn-kpi` prefix. Inline sparkline in trend column.

## cohortGrid (src/ts/cohort-grid.ts)

```ts
function cohortGrid(el: HTMLElement, rows: CohortRow[], opts?: CohortGridOptions): CohortGridController
```

**CohortRow**: `label`, `initialSize`, `retention: number[]` (0-1 fractions)
**Options**: `periodLabels?`, `showAbsolute?`, `onHover?`, `colorHigh?`, `colorLow?`
**Controller**: `update(rows, opts?)`, `destroy()`
**CSS**: `mn-cohort` prefix. Color-interpolated cells from low (red) to high (green).

## approvalChain (src/ts/approval-chain.ts)

```ts
function approvalChain(el: HTMLElement, steps: ApprovalStep[], opts?: ApprovalChainOptions): ApprovalChainController
```

**ApprovalStep**: `id`, `name`, `role?`, `status: ApprovalStatus`, `timestamp?`, `comment?`
**ApprovalStatus**: `'pending' | 'approved' | 'rejected' | 'skipped' | 'current'`
**Options**: `onAction?`, `editable?`, `orientation?` (`horizontal` | `vertical`)
**Controller**: `update(steps)`, `setStatus(id, status, timestamp?)`, `destroy()`
**CSS**: `mn-approval` prefix. Avatar initials, status badges, action buttons on current step.

## bcgMatrix (src/ts/charts-bcg-matrix.ts)

```ts
function bcgMatrix(canvas: HTMLCanvasElement, opts: BCGMatrixOptions): BCGMatrixController | undefined
```

**BCGItem**: `id`, `label`, `marketShare` (0-1), `growthRate` (%), `size?`, `color?`
**Options**: `items[]`, `height?`, `shareThreshold?` (0.5), `growthThreshold?` (10), `onHover?`, `onClick?`, `animate?`
**Controller**: `update(items)`, `destroy()`
**Quadrants**: Stars, Cash Cows, ? Marks, Dogs. A11y sr-only table with quadrant labels.

## nineBoxMatrix (src/ts/nine-box-matrix.ts)

```ts
function nineBoxMatrix(el: HTMLElement, opts: NineBoxMatrixOptions): NineBoxMatrixController
```

**NineBoxItem**: `id`, `label`, `x: 1|2|3`, `y: 1|2|3`, `subtitle?`, `color?`
**Options**: `items[]`, `xLabel?`, `yLabel?`, `xAxisLabels?`, `yAxisLabels?`, `onSelect?`, `onMove?`
**Controller**: `update(items)`, `moveItem(id, x, y)`, `getItems()`, `destroy()`
**CSS**: `mn-nine-box` prefix. Click-to-select + arrow-key move. Tier colors: invest/selective/divest.

## swotMatrix (src/ts/swot-matrix.ts)

```ts
function swotMatrix(el: HTMLElement, opts?: SwotMatrixOptions): SwotMatrixController
```

**SwotItem**: `id`, `text`, `quadrant: SwotQuadrant`
**SwotQuadrant**: `'strengths' | 'weaknesses' | 'opportunities' | 'threats'`
**Options**: `items?`, `editable?` (true), `onChange?`, `quadrantLabels?`
**Controller**: `getItems()`, `addItem(quadrant, text)`, `removeItem(id)`, `update(items)`, `destroy()`
**CSS**: `mn-swot` prefix. 2x2 grid, inline add/remove per quadrant.

## decisionMatrix (src/ts/decision-matrix.ts)

```ts
function decisionMatrix(el: HTMLElement, opts: DecisionMatrixOptions): DecisionMatrixController
```

**DecisionCriterion**: `id`, `label`, `weight: number`
**DecisionAlternative**: `id`, `label`, `scores: Record<string, number>` (1-10)
**Options**: `criteria[]`, `alternatives[]`, `editable?`, `onChange?`
**Controller**: `update(alternatives)`, `getScores()`, `destroy()`
**CSS**: `mn-decision-matrix` prefix. Weighted totals, auto-ranking, inline editing.

## waterfallChart (src/ts/charts-waterfall.ts)

```ts
function waterfallChart(canvas: HTMLCanvasElement, opts: WaterfallChartOptions): void
```

**WaterfallSegment**: `label`, `value`, `isTotal?`
**Options**: `segments[]`, `unit?`, `animate?` (true), `height?`
**A11y**: `role="img"`, sr-only table with segment/value/running-total columns. Fire-and-forget (no controller).

## confidenceChart (src/ts/charts-confidence.ts)

```ts
function confidenceChart(canvas: HTMLCanvasElement, opts: ConfidenceChartOptions): void
```

**Options**: `labels[]`, `values[]`, `lower[]`, `upper[]`, `unit?`, `color?`, `animate?`, `height?`
**A11y**: `role="img"`, sr-only table with label/value/lower/upper columns. Fire-and-forget (no controller).

## dateRangePicker (src/ts/date-range-picker.ts)

```ts
function dateRangePicker(el: HTMLElement, opts?: DateRangePickerOptions): DateRangePickerController
```

**DateRange**: `{ from: string | null; to: string | null }` (ISO dates)
**Options**: `value?`, `min?`, `max?`, `placeholder?`, `onChange?`
**Controller**: `getValue()`, `setValue(range)`, `open()`, `close()`, `destroy()`
**CSS**: `mn-drp` prefix. Calendar popup, Monday-start weeks, min/max constraints.

## activityFeed (src/ts/activity-feed.ts)

```ts
function activityFeed(el: HTMLElement, items?: ActivityItem[], opts?: ActivityFeedOptions): ActivityFeedController
```

**ActivityItem**: `id`, `title`, `body?`, `meta?`, `icon?` (SVG string), `type?`
**Options**: `maxItems?`, `animate?` (true)
**Controller**: `add(item)`, `prepend(item)`, `clear()`, `destroy()`
**CSS**: `mn-feed` prefix. ARIA: `role="feed"`. Slide-in animation.

## bulletChart (src/ts/charts-bullet.ts)

```ts
function bulletChart(canvas: HTMLCanvasElement, opts: BulletChartOptions): void
```

**BulletRange**: `max`, `color?`, `label?`
**Options**: `value`, `target`, `max`, `label?`, `unit?`, `ranges?`, `height?`, `animate?`
**A11y**: `role="img"` with value/target/percentage label. Fire-and-forget (no controller).

## notificationCenter (src/ts/notification-center.ts)

```ts
function notificationCenter(triggerEl: HTMLElement, opts?: NotificationCenterOptions): NotificationCenterController
```

**MnNotification**: `id`, `title`, `body?`, `type?`, `timestamp?`, `read?`, `action?`
**Options**: `maxVisible?` (50), `onAction?`, `position?` (`right` | `left`)
**Controller**: `add(n)`, `markRead(id)`, `markAllRead()`, `remove(id)`, `clear()`, `getUnreadCount()`, `open()`, `close()`, `toggle()`, `destroy()`
**CSS**: `mn-notif-panel`, `mn-notif-item` prefixes. ARIA: `role="dialog"`. Backdrop + Escape close.
