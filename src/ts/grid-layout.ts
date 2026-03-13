/**
 * Maranello Luce Design — Grid Layout Helper
 * Applies preset grid templates to a container element.
 */

export type GridTemplateName =
  | 'overview-4col'
  | 'sidebar-main'
  | 'triple-equal'
  | 'dashboard-kpi'
  | 'focus-detail'
  | 'masonry-auto';

export interface GridLayoutOptions {
  gap?: string;
  padding?: string;
  animate?: boolean;
}

export interface GridLayoutController {
  setTemplate: (name: GridTemplateName) => void;
  getTemplate: () => GridTemplateName;
  destroy: () => void;
}

const TEMPLATES: GridTemplateName[] = [
  'overview-4col', 'sidebar-main', 'triple-equal',
  'dashboard-kpi', 'focus-detail', 'masonry-auto',
];

const CLASS_PREFIX = 'mn-grid-template--';

export function gridLayout(
  container: HTMLElement | string,
  template: GridTemplateName = 'masonry-auto',
  options?: GridLayoutOptions,
): GridLayoutController | null {
  const target = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;
  if (!target) return null;
  const host = target;
  const opts = { gap: '', padding: '', animate: true, ...options };
  let current = template;

  host.classList.add('mn-grid-template');
  if (opts.gap) host.style.gap = opts.gap;
  if (opts.padding) host.style.padding = opts.padding;

  function applyTemplate(name: GridTemplateName): void {
    TEMPLATES.forEach((item) => host.classList.remove(CLASS_PREFIX + item));
    host.classList.add(CLASS_PREFIX + name);
    current = name;

    if (opts.animate) {
      const { children } = host;
      for (let index = 0; index < children.length; index += 1) {
        const child = children[index] as HTMLElement;
        child.style.opacity = '0';
        child.style.transform = 'translateY(8px)';
        setTimeout(() => {
          child.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          child.style.opacity = '1';
          child.style.transform = 'none';
        }, index * 50);
      }
    }
  }

  applyTemplate(current);

  return {
    setTemplate: applyTemplate,
    getTemplate: () => current,
    destroy: () => {
      host.classList.remove('mn-grid-template');
      TEMPLATES.forEach((item) => host.classList.remove(CLASS_PREFIX + item));
    },
  };
}
