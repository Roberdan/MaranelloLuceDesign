/**
 * Maranello Luce Design - Panel type definitions
 * Extracted from: detail-panel-ui, detail-panel-renderers,
 *   detail-panel-editors, detail-panel, okr-panel-hero, okr-panel-cards
 */

// --- Detail Panel ---

export type DetailFieldType =
  | 'text' | 'number' | 'date' | 'select' | 'status'
  | 'person' | 'score' | 'textarea' | 'readonly' | 'badge' | 'custom'
  | 'country';

export interface DetailFieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  custom?: (value: unknown) => string | null;
}

export interface DetailFieldOption {
  value: string;
  label: string;
}

export interface DetailPersonItem {
  id?: string;
  name: string;
  email?: string;
  initials?: string;
}

export interface DetailParentLink {
  label: string;
  onClick: () => void;
}

export interface DetailExternalLink {
  label: string;
  url: string;
}

export interface DetailField {
  key: string;
  label: string;
  type?: DetailFieldType;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
  editable?: boolean;
  options?: Array<string | DetailFieldOption>;
  statusColors?: Record<string, string>;
  badgeColors?: Record<string, string>;
  validate?: DetailFieldValidation;
  onSearch?: (query: string) => DetailPersonItem[] | Promise<DetailPersonItem[]>;
  searchFn?: (q: string) => Promise<Array<{ id: string; name: string; email?: string; initials?: string }>>;
  render?: (value: unknown, data: Record<string, unknown>) => HTMLElement;
}

export interface DetailSection {
  section?: string;
  tab?: string;
  fields?: DetailField[];
}

export interface DetailFooterAction {
  label: string;
  ghost?: boolean;
  onClick?: () => void;
}

export interface DetailPanelOptions {
  title?: string;
  schema?: DetailSection[];
  data?: Record<string, unknown>;
  editable?: boolean;
  /** 'overlay' (default) = fixed slide-over with backdrop; 'inline' = relative, no backdrop */
  mode?: 'overlay' | 'inline';
  onSave?: (
    changes: Record<string, unknown>,
    data: Record<string, unknown>,
  ) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;
  onClose?: () => void;
  tabs?: string[];
  subComponents?: Record<
    string,
    (
      body: HTMLElement,
      data: Record<string, unknown>,
      ctx: { isEditing: boolean; changes: Record<string, unknown> },
    ) => void
  >;
  tabRenderers?: Record<string, (body: HTMLElement, data: unknown) => void>;
  parentLink?: DetailParentLink;
  externalLinks?: DetailExternalLink[];
  footerActions?: DetailFooterAction[];
}

export interface DetailPanelState {
  data: Record<string, unknown>;
  schema: DetailSection[];
  isEditing: boolean;
  isSaving: boolean;
  changes: Record<string, unknown>;
  errors: Record<string, string>;
  isOpen: boolean;
  activeTab: string | null;
  isDirty: boolean;
}

export interface DetailPanelController {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  save: () => void;
  isEditing: () => boolean;
  isDirty: () => boolean;
  setData: (newData: Record<string, unknown>) => void;
  getData: () => Record<string, unknown>;
  setTitle: (t: string) => void;
  showLoading: () => void;
  setTab: (tab: string) => void;
  render: () => void;
  showToast: (msg: string, type?: string) => void;
  destroy: () => void;
}

export type DetailRenderer = (
  val: unknown,
  field: DetailField,
  data: Record<string, unknown>,
) => HTMLElement;

export type DetailEditor = (
  val: unknown,
  field: DetailField,
  onChange: (newVal: unknown) => void,
) => HTMLElement;

// --- OKR Panel ---

export type OkrStatus = 'on-track' | 'at-risk' | 'behind';
export type OkrScope = 'STUDIO' | 'ORG' | 'GLOBAL' | (string & Record<never, never>);

export interface KeyResultInput {
  title?: string;
  current?: number;
  target?: number;
  unit?: string;
}

export interface ObjectiveInput {
  title?: string;
  scope?: OkrScope;
  progress?: number;
  status?: OkrStatus;
  keyResults?: KeyResultInput[];
}

export interface Objective {
  title: string;
  scope: OkrScope;
  progress: number;
  status: OkrStatus;
  keyResults: KeyResultInput[];
}

export interface OkrStats {
  counts: Record<OkrStatus, number>;
  average: number;
}

export interface OkrPanelOptions {
  title?: string;
  period?: string;
  objectives?: ObjectiveInput[];
}

export interface OkrPanelController {
  update: (opts: OkrPanelOptions) => void;
  destroy: () => void;
}
