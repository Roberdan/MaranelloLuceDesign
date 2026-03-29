'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ShellConfig } from '../config/shell-schema';

interface AppShellContextValue {
  shell: ShellConfig;
  query: string;
  setQuery: (value: string) => void;
  activePanelTab: string | null;
  setActivePanelTab: (value: string | null) => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ shell, children }: { shell: ShellConfig; children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [activePanelTab, setActivePanelTab] = useState<string | null>(shell.panel?.tabs?.[0]?.id || null);
  const value = useMemo(() => ({ shell, query, setQuery, activePanelTab, setActivePanelTab }), [shell, query, activePanelTab]);
  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell() {
  const value = useContext(AppShellContext);
  if (!value) throw new Error('useAppShell must be used inside AppShellProvider');
  return value;
}
