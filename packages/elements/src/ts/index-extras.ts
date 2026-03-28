/**
 * Maranello Luce Design — v4.x component re-exports (dashboard, analytics, strategy, agentic)
 * Kept in a separate barrel so index.ts stays under the 250-line limit.
 */

// v4.5
export { openSearchDrawer } from './search-drawer';
export type { SearchDrawerOptions, SearchDrawerResult, SearchDrawerController } from './search-drawer';

// v4.6 — Dashboard widgets
export { activityFeed } from './activity-feed';
export type { ActivityItem, ActivityFeedOptions, ActivityFeedController } from './activity-feed';
export { dateRangePicker } from './date-range-picker';
export type { DateRange, DateRangePickerOptions, DateRangePickerController } from './date-range-picker';
export { bulletChart } from './charts-bullet';
export type { BulletRange, BulletChartOptions } from './charts-bullet';
export { notificationCenter } from './notification-center';
export type { MnNotification, NotificationCenterOptions, NotificationCenterController } from './notification-center';

// v4.7 — Analytics & AI
export { waterfallChart } from './charts-waterfall';
export type { WaterfallSegment, WaterfallChartOptions } from './charts-waterfall';
export { confidenceChart } from './charts-confidence';
export type { ConfidenceChartOptions } from './charts-confidence';
export { decisionMatrix } from './decision-matrix';
export type { DecisionCriterion, DecisionAlternative, DecisionMatrixOptions, DecisionMatrixController } from './decision-matrix';
export { renderSourceCards } from './source-card';
export type { SourceCard, SourceCardsOptions, SourceCardsController } from './source-card';

// v4.8 — Strategy & Consulting
export { bcgMatrix } from './charts-bcg-matrix';
export type { BCGItem, BCGMatrixOptions, BCGMatrixController } from './charts-bcg-matrix';
export { nineBoxMatrix } from './nine-box-matrix';
export type { NineBoxItem, NineBoxMatrixOptions, NineBoxMatrixController } from './nine-box-matrix';
export { swotMatrix } from './swot-matrix';
export type { SwotItem, SwotMatrixOptions, SwotMatrixController, SwotQuadrant } from './swot-matrix';
export { approvalChain } from './approval-chain';
export type { ApprovalStep, ApprovalStatus, ApprovalChainOptions, ApprovalChainController } from './approval-chain';

// v4.9 — Agentic AI
export { agentTrace } from './agent-trace';
export type { TraceStep, TraceStepStatus, TraceStepKind, AgentTraceOptions, AgentTraceController } from './agent-trace';
export { tokenMeter } from './token-meter';
export type { TokenUsage, TokenMeterOptions, TokenMeterController } from './token-meter';
export { streamingText } from './streaming-text';
export type { StreamingTextOptions, StreamingTextController } from './streaming-text';

// v4.9 — Business Intelligence
export { riskMatrix } from './charts-risk-matrix';
export type { RiskItem, RiskMatrixOptions, RiskMatrixController } from './charts-risk-matrix';
export { kpiScorecard } from './kpi-scorecard';
export type { KpiRow, KpiStatus, KpiScorecardOptions, KpiScorecardController } from './kpi-scorecard';
export { cohortGrid } from './cohort-grid';
export type { CohortRow, CohortGridOptions, CohortGridController } from './cohort-grid';

// v4.10 — Admin & FinOps
export { auditLog } from './audit-log';
export type { AuditEntry, AuditSeverity, AuditLogOptions, AuditLogController } from './audit-log';
export { agentCostBreakdown } from './agent-cost-breakdown';
export type { AgentCostRow, AgentCostBreakdownOptions, AgentCostBreakdownController } from './agent-cost-breakdown';
export { costTimeline } from './charts-cost-timeline';
export type { CostSeries, CostTimelineOptions, CostTimelineController } from './charts-cost-timeline';
export { businessModelCanvas } from './business-model-canvas';
export type { BmcBlockId, BmcItem, BmcBlock, BusinessModelCanvasOptions, BusinessModelCanvasController } from './business-model-canvas';
export { userTable } from './user-table';
export type { AdminUser, UserRole, UserStatus, UserTableOptions, UserTableController } from './user-table';

// v4.19 — Customer Journey + Admin Components
export { customerJourney } from './customer-journey';
export type { JourneyPhase, JourneyEngagement, EngagementStatus, EngagementType, CustomerJourneyOptions, CustomerJourneyController } from './customer-journey';
export { adminShell } from './admin-shell';
export type { AdminShellNavItem, AdminShellOpts, AdminShellController } from './admin-shell';
export { sectionCard } from './section-card';
export type { SectionCardOpts, SectionCardController } from './section-card';
export { settingsPanel } from './settings-panel';
export type { SettingsPanelSection, SettingsPanelOpts, SettingsPanelController } from './settings-panel';

// v5.10 — Dashboard Strip
export { dashboardStrip } from './dashboard-strip';
export type { DashboardStripOptions, DashboardStripController, StripZone, StripGaugeZone, StripPipelineZone, StripTrendZone, StripBoardZone, StripPipelineRow, StripTrendItem, StripBoardStat } from './core/types';

// Capacity Heatmap
export { heatmap } from './heatmap';
export type { HeatmapCell, HeatmapRow, HeatmapOptions, HeatmapController } from './heatmap';
