/**
 * Maranello Luce Design - Dashboard strip zone type definitions
 * Used by dashboard-strip and dashboard-strip-zones modules.
 */
import type { GaugeConfig, GaugeSize, SpeedometerOptions } from './gauge-types';

export interface StripGaugeZone {
  type: 'gauge';
  label?: string;
  gaugeConfig: GaugeConfig;
  size?: GaugeSize;
}

export interface StripPipelineRow {
  label: string;
  value: number;
  color: string;
  secondary?: string;
}

export interface StripPipelineZone {
  type: 'pipeline';
  title?: string;
  rows: StripPipelineRow[];
  maxValue?: number;
  footer?: { label: string; value: string };
}

export interface StripTrendItem {
  label: string;
  value: number | string;
  color: string;
  data: number[];
}

export interface StripTrendZone {
  type: 'trend';
  title?: string;
  items: StripTrendItem[];
}

export interface StripBoardStat {
  label: string;
  value: number | string;
}

export interface StripBoardZone {
  type: 'board';
  title?: string;
  stats?: StripBoardStat[];
  gauge?: GaugeConfig;
  gaugeSize?: GaugeSize;
  gaugeLabel?: string;
}

export type StripZone = StripGaugeZone | StripPipelineZone | StripTrendZone | StripBoardZone;

export interface DashboardStripOptions {
  zones: StripZone[];
  animate?: boolean;
  ariaLabel?: string;
}

export interface DashboardStripController {
  updateZone: (index: number, data: Partial<StripZone>) => void;
  destroy: () => void;
}
