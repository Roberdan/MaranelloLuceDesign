import type { ReactNode } from 'react';

export interface AgentPanelProps {
  title?: string;
  summary?: string;
  actions?: Array<{ id: string; label: string }>;
  children?: ReactNode;
}

export function AgentPanel({
  title = 'Agent workspace',
  summary = 'Use this space for AI suggestions, runbooks, and structured actions.',
  actions = [],
  children,
}: AgentPanelProps) {
  return (
    <section className="mn-card mn-stack-sm" aria-label={title}>
      <div>
        <h3 className="mn-title-sm">{title}</h3>
        <p className="mn-body-sm">{summary}</p>
      </div>
      {actions.length ? (
        <div className="mn-toolbar-row">
          {actions.map((action) => (
            <button key={action.id} type="button" className="mn-btn mn-btn--ghost">
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
      {children ? <div className="mn-stack-sm">{children}</div> : null}
    </section>
  );
}
