/**
 * Maranello Luce Design - Chart type definitions
 * Extracted from: charts-helpers, charts-basic, charts-bar, charts-area,
 *   charts-advanced, charts-viz, chart-interact, h-bar-chart
 */

// --- Charts core ---

export interface ChartSeriesDataset {
  label?: string;
  color?: string;
  data: number[];
}

export interface ChartRenderOptions {
  width?: number;
  height?: number;
  padding?: number;
  animate?: boolean;
  responsive?: boolean;
}

export interface ChartsPublicApi {
  sparkline: (canvas: HTMLCanvasElement, data: number[], opts?: SparklineOptions) => void;
  donut: (canvas: HTMLCanvasElement, segments: DonutSegment[], opts?: DonutOptions) => void;
  halfGauge: (canvas: HTMLCanvasElement, opts?: HalfGaugeOptions) => void;
  barChart: (canvas: HTMLCanvasElement, data: BarDataItem[], opts?: BarChartOptions) => void;
  liveGraph: (canvas: HTMLCanvasElement, data: number[], opts?: LiveGraphOptions) => void;
  areaChart: (canvas: HTMLCanvasElement, datasets: AreaDataset[], opts?: AreaChartOptions) => void;
  progressRing: (container: HTMLElement, opts?: ProgressRingOptions) => void;
  flipCounter: (container: HTMLElement, opts?: FlipCounterOptions) => void;
  radar: (canvas: HTMLCanvasElement, data: RadarDataItem[], opts?: RadarOptions) => void;
  bubble: (canvas: HTMLCanvasElement, data: BubbleDataItem[], opts?: BubbleOptions) => void;
}

// --- Sparkline ---

export interface SparklineOptions {
  color?: string;
  fillOpacity?: number;
  lineWidth?: number;
  smooth?: boolean;
  showDot?: boolean;
}

// --- Donut ---

export interface DonutSegment {
  value: number;
  color: string;
}

export interface DonutOptions {
  thickness?: number;
  animate?: boolean;
  centerText?: string;
  centerSubtext?: string;
}

// --- Half Gauge ---

export interface HalfGaugeColorStop {
  stop: number;
  color: string;
}

export interface HalfGaugeOptions {
  value?: number;
  min?: number;
  max?: number;
  colors?: HalfGaugeColorStop[];
  trackColor?: string;
  thickness?: number;
  label?: string;
  unit?: string;
}

// --- Bar chart ---

export interface BarDataItem {
  value: number;
  label?: string;
  color?: string;
}

export interface BarChartOptions extends ChartRenderOptions {
  barWidth?: number;
  gap?: number;
  showLabels?: boolean;
  showValues?: boolean;
  horizontal?: boolean;
}

// --- Area chart ---

export interface AreaDataset {
  color?: string;
  data: number[];
}

export interface AreaChartOptions extends ChartRenderOptions {
  fillOpacity?: number;
  smooth?: boolean;
  showDots?: boolean;
  labels?: string[];
}

export interface LiveGraphOptions extends ChartRenderOptions {
  color?: string;
  fillOpacity?: number;
  lineWidth?: number;
}

// --- Progress Ring ---

export interface ProgressRingOptions {
  value?: number;
  max?: number;
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  animate?: boolean;
}

// --- Flip Counter ---

export interface FlipCounterOptions {
  value?: number;
  digits?: number;
  decimals?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  animationDuration?: number;
  padZero?: boolean;
}

// --- Radar ---

export interface RadarDataItem {
  label: string;
  value: number;
}

export interface RadarOptions extends ChartRenderOptions {
  color?: string;
  fillOpacity?: number;
  gridColor?: string;
  gridLevels?: number;
  showLabels?: boolean;
}

// --- Bubble ---

export interface BubbleDataItem {
  x: number;
  y: number;
  z?: number;
  label?: string;
  color?: string;
}

export interface BubbleOptions extends ChartRenderOptions {
  xLabel?: string;
  yLabel?: string;
  showGrid?: boolean;
  minRadius?: number;
  maxRadius?: number;
}

// --- H-Bar Chart ---

export interface HBarData {
  label?: string;
  value?: number;
  color?: string;
}

export interface HBarChartOptions {
  title?: string;
  bars?: HBarData[];
  unit?: string;
  maxValue?: number;
  showValues?: boolean;
  showGrid?: boolean;
  sortDescending?: boolean;
  animate?: boolean;
  barHeight?: number;
  onClick?: (bar: HBarData, index: number) => void;
}

export interface HBarChartController {
  update: (bars: HBarData[]) => void;
  destroy: () => void;
}
