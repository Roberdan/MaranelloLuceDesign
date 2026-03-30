export interface StarterManifest {
  id: string;
  name: string;
  description: string;
  category: 'workspace' | 'dashboard' | 'executive' | 'program-management';
  dependencies: string[];
  files: string[];
}

export const STARTER_MANIFESTS: StarterManifest[] = [
  {
    id: 'shared-shell',
    name: 'Shared Shell',
    description: 'Configuration-driven shared app shell starter for Convergio templates',
    category: 'workspace',
    dependencies: ['@convergio/design-elements', '@convergio/design-tokens'],
    files: [
      'src/index.ts',
      'src/contracts.ts',
      'src/adapters.ts',
      'src/deploy.ts',
      'src/next-template.ts',
      'src/runtime.ts',
      'package.json',
      'tsconfig.json',
    ],
  },
  {
    id: 'workspace',
    name: 'Workspace',
    description: 'General-purpose workspace app starter with project switching, search, and command palette',
    category: 'workspace',
    dependencies: ['@convergio/design-elements', '@convergio/design-tokens'],
    files: [
      'src/index.ts',
      'src/workspace-config.ts',
      'package.json',
      'tsconfig.json',
    ],
  },
  {
    id: 'ops-dashboard',
    name: 'Ops Dashboard',
    description: 'Operational dashboard starter with live metrics, pipeline status, and alert panels',
    category: 'dashboard',
    dependencies: ['@convergio/design-elements', '@convergio/design-tokens'],
    files: [
      'src/index.ts',
      'src/ops-config.ts',
      'package.json',
      'tsconfig.json',
    ],
  },
  {
    id: 'executive-cockpit',
    name: 'Executive Cockpit',
    description: 'Executive-level dashboard starter with KPI cards, narrative hero, and board summary',
    category: 'executive',
    dependencies: ['@convergio/design-elements', '@convergio/design-tokens'],
    files: [
      'src/index.ts',
      'src/cockpit-config.ts',
      'package.json',
      'tsconfig.json',
    ],
  },
  {
    id: 'program-management',
    name: 'Program Management',
    description: 'Program management starter with command rail, KPI strip, portfolio list, and gantt board',
    category: 'program-management',
    dependencies: ['@convergio/design-elements', '@convergio/design-tokens'],
    files: [
      'src/index.ts',
      'src/pm-config.ts',
      'package.json',
      'tsconfig.json',
    ],
  },
];
