import type { ReactNode } from 'react';
import type { NavigationSchema } from '../config/navigation-schema';
import type { ShellConfig } from '../config/shell-schema';

export interface AppShellProps {
  shell: ShellConfig;
  navigation: NavigationSchema;
  toolbar?: ReactNode;
  filterBar?: ReactNode;
  executiveStrip?: ReactNode;
  children: ReactNode;
  detail?: ReactNode;
  secondary?: ReactNode;
  bottom?: ReactNode;
  agent?: ReactNode;
}

function renderNav(items: NavigationSchema['primary']) {
  return items.map((item) => (
    <a key={item.id} className="mn-sidebar__item" href={item.href}>
      <span>{item.label}</span>
      {item.badge ? <span className="mn-sidebar__badge">{item.badge}</span> : null}
    </a>
  ));
}

export function AppShell({
  shell,
  navigation,
  toolbar,
  filterBar,
  executiveStrip,
  children,
  detail,
  secondary,
  bottom,
  agent,
}: AppShellProps) {
  const hasDetail = !!detail && shell.featureFlags.detailPanel !== false;
  const hasAgent = !!agent && shell.featureFlags.agentPanel !== false;
  const hasSecondary = !!secondary;
  const hasBottom = !!bottom;
  const shellClass = [
    'mn-app-shell',
    hasDetail ? 'mn-app-shell--side-detail' : hasSecondary ? 'mn-app-shell--split' : 'mn-app-shell--full',
    hasBottom ? 'mn-app-shell--bottom-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={shellClass} data-shell-mode={shell.mode}>
      <aside className="mn-app-shell__nav">
        <div className="mn-sidebar">
          <div className="mn-sidebar__header">
            <div className="mn-sidebar__brand">{shell.title}</div>
            {shell.subtitle ? <div className="mn-micro">{shell.subtitle}</div> : null}
          </div>
          <nav className="mn-sidebar__nav">{renderNav(navigation.primary)}</nav>
        </div>
      </aside>
      <header className="mn-app-shell__toolbar">{toolbar}</header>
      <div className="mn-app-shell__filter-bar">{filterBar}</div>
      <main className="mn-app-shell__main">
        {executiveStrip ? <div className="mn-stack-md">{executiveStrip}</div> : null}
        {children}
      </main>
      {secondary ? <aside className="mn-app-shell__secondary">{secondary}</aside> : null}
      {hasDetail ? <aside className="mn-app-shell__detail">{detail}</aside> : null}
      {bottom ? <section className="mn-app-shell__bottom">{bottom}</section> : null}
      {hasAgent ? <aside data-shell-role="agent">{agent}</aside> : null}
    </div>
  );
}
