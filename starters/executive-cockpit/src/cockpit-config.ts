import type { SharedShellConfig } from '@convergio/shared-shell-starter';

export interface KpiCard {
  id: string;
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'flat';
  unit?: string;
}

export interface NarrativeHero {
  headline: string;
  summary: string;
}

export interface BoardSummary {
  id: string;
  title: string;
  columns: string[];
  rows: number;
}

export interface CockpitConfig extends SharedShellConfig {
  heroKpis: KpiCard[];
  narrativeHero?: NarrativeHero;
  boardSummaries?: BoardSummary[];
  drillDownPaths?: Record<string, string>;
}

const DEFAULT_HERO_KPIS: KpiCard[] = [
  { id: 'revenue', label: 'Revenue YTD', value: '$4.2B', trend: 'up', unit: 'USD' },
  { id: 'ebitda', label: 'EBITDA Margin', value: '23.4%', trend: 'up' },
  { id: 'cash', label: 'Free Cash Flow', value: '$820M', trend: 'flat', unit: 'USD' },
  { id: 'headcount', label: 'Headcount', value: '12,400', trend: 'down' },
  { id: 'nps', label: 'Customer NPS', value: '68', trend: 'up' },
];

const DEFAULT_BOARD_SUMMARIES: BoardSummary[] = [
  {
    id: 'q2-portfolio',
    title: 'Q2 Portfolio Health',
    columns: ['Division', 'Status', 'Revenue', 'Variance'],
    rows: 6,
  },
  {
    id: 'risk-register',
    title: 'Risk Register',
    columns: ['Risk', 'Likelihood', 'Impact', 'Owner', 'Due'],
    rows: 8,
  },
  {
    id: 'initiatives',
    title: 'Strategic Initiatives',
    columns: ['Initiative', 'Phase', 'Budget', 'Lead', 'Target'],
    rows: 5,
  },
];

const DEFAULT_DRILL_DOWN_PATHS: Record<string, string> = {
  revenue: '/revenue',
  ebitda: '/revenue#ebitda',
  cash: '/operations#cashflow',
  headcount: '/people',
  nps: '/portfolio#customer',
};

export function createCockpitConfig(overrides?: Partial<CockpitConfig>): CockpitConfig {
  const base: CockpitConfig = {
    appName: 'Executive Cockpit',
    appDescription: 'CEO / CFO decision-oriented view',
    currentPath: '/overview',
    themes: ['editorial', 'avorio', 'navy'],
    header: {
      brandLabel: 'Convergio',
      productLabel: 'Executive',
      homeHref: '/',
      primaryActions: [
        { id: 'refresh', label: 'Refresh Data', href: '/refresh' },
        { id: 'share', label: 'Share View', href: '/share' },
      ],
      searchPlaceholder: 'Search KPIs, divisions, initiatives',
    },
    navigation: [
      {
        id: 'executive',
        label: 'Executive',
        items: [
          { id: 'overview', label: 'Overview', href: '/overview' },
          { id: 'revenue', label: 'Revenue', href: '/revenue' },
          { id: 'operations', label: 'Operations', href: '/operations' },
          { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
          { id: 'people', label: 'People', href: '/people' },
        ],
      },
    ],
    content: {
      title: 'Executive Overview',
      eyebrow: 'Board-ready metrics',
      body: '<section data-slot="primary">Hero KPIs and narrative summaries</section>',
    },
    heroKpis: JSON.parse(JSON.stringify(DEFAULT_HERO_KPIS)),
    narrativeHero: {
      headline: 'Q2 on track: revenue ahead of plan, margin expanding',
      summary:
        'Group revenue of $4.2B is 3% ahead of the Q2 plan, driven by strong ' +
        'performance in the Americas and APAC segments. EBITDA margin improved ' +
        '180 bps year-on-year. Free cash flow conversion remains solid at 94%.',
    },
    boardSummaries: JSON.parse(JSON.stringify(DEFAULT_BOARD_SUMMARIES)),
    drillDownPaths: JSON.parse(JSON.stringify(DEFAULT_DRILL_DOWN_PATHS)),
  };

  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
    heroKpis: overrides.heroKpis ?? JSON.parse(JSON.stringify(DEFAULT_HERO_KPIS)),
    boardSummaries: overrides.boardSummaries ?? JSON.parse(JSON.stringify(DEFAULT_BOARD_SUMMARIES)),
    drillDownPaths: overrides.drillDownPaths ?? JSON.parse(JSON.stringify(DEFAULT_DRILL_DOWN_PATHS)),
  };
}
