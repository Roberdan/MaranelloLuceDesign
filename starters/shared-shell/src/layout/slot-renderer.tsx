import type { ReactNode } from 'react';

export interface SlotRendererProps {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
}

export function SlotRenderer({ title, eyebrow, children }: SlotRendererProps) {
  return (
    <section className="mn-slot-card">
      {eyebrow ? <div className="mn-slot-card__eyebrow">{eyebrow}</div> : null}
      {title ? <h2 className="mn-title-sm mn-slot-card__title">{title}</h2> : null}
      <div className="mn-slot-card__body">{children}</div>
    </section>
  );
}
