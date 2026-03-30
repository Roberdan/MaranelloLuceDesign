export interface SharedShellAction {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

export interface SharedShellHeaderConfig {
  brandLabel: string;
  productLabel: string;
  homeHref: string;
  primaryActions: SharedShellAction[];
  utilityActions?: SharedShellAction[];
  searchPlaceholder?: string;
}

export interface SharedShellNavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export interface SharedShellNavSection {
  id: string;
  label: string;
  items: SharedShellNavItem[];
}

export interface SharedShellContentConfig {
  title: string;
  eyebrow?: string;
  body: string;
  supporting?: string;
}

export interface SharedShellDetailPanelConfig {
  title: string;
  description?: string;
  body: string;
}

export interface SharedShellConfig {
  appName: string;
  appDescription: string;
  currentPath: string;
  themes: string[];
  header: SharedShellHeaderConfig;
  navigation: SharedShellNavSection[];
  content: SharedShellContentConfig;
  detailPanel?: SharedShellDetailPanelConfig;
}

export interface SharedShellState {
  activeItemId: string;
  currentPath: string;
}

export interface SharedShellController {
  destroy: () => void;
  getState: () => Readonly<SharedShellState>;
  setActiveItem: (itemId: string) => void;
}
