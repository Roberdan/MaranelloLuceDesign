/**
 * Maranello Luce Design — Mobile sidebar toggle
 * Toggles mn-sidebar--mobile-open class with backdrop, ESC close, matchMedia auto-close.
 */

let backdrop: HTMLDivElement | null = null;

function ensureBackdrop(): HTMLDivElement {
  if (backdrop) return backdrop;
  backdrop = document.createElement('div');
  backdrop.className = 'mn-sidebar__backdrop';
  document.body.appendChild(backdrop);
  return backdrop;
}

function closeSidebar(sidebar: HTMLElement): void {
  sidebar.classList.remove('mn-sidebar--mobile-open');
  const bd = ensureBackdrop();
  bd.classList.remove('mn-sidebar__backdrop--visible');
}

function openSidebar(sidebar: HTMLElement): void {
  sidebar.classList.add('mn-sidebar--mobile-open');
  const bd = ensureBackdrop();
  bd.classList.add('mn-sidebar__backdrop--visible');
}

/**
 * Initialize sidebar toggle for a specific sidebar and trigger element.
 * Returns a cleanup function.
 */
export function initSidebarToggle(
  sidebarEl: HTMLElement,
  triggerEl: HTMLElement,
): () => void {
  const bd = ensureBackdrop();

  const onTrigger = () => {
    if (sidebarEl.classList.contains('mn-sidebar--mobile-open')) {
      closeSidebar(sidebarEl);
    } else {
      openSidebar(sidebarEl);
    }
  };

  const onBackdrop = () => closeSidebar(sidebarEl);

  const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && sidebarEl.classList.contains('mn-sidebar--mobile-open')) {
      closeSidebar(sidebarEl);
    }
  };

  const mql = window.matchMedia('(min-width: 641px)');
  const onDesktop = (e: MediaQueryList | MediaQueryListEvent) => {
    if ('matches' in e && e.matches) closeSidebar(sidebarEl);
  };

  triggerEl.addEventListener('click', onTrigger);
  bd.addEventListener('click', onBackdrop);
  document.addEventListener('keydown', onEsc);
  mql.addEventListener('change', onDesktop);

  return () => {
    triggerEl.removeEventListener('click', onTrigger);
    bd.removeEventListener('click', onBackdrop);
    document.removeEventListener('keydown', onEsc);
    mql.removeEventListener('change', onDesktop);
  };
}

/**
 * Auto-detect sidebar and hamburger trigger by convention.
 * Sidebar: .mn-sidebar, Trigger: [data-sidebar-toggle] or .mn-sidebar-toggle
 */
export function initSidebarToggleAuto(): (() => void) | null {
  const sidebar = document.querySelector<HTMLElement>('.mn-sidebar');
  const trigger = document.querySelector<HTMLElement>('[data-sidebar-toggle], .mn-sidebar-toggle');
  if (!sidebar || !trigger) return null;
  return initSidebarToggle(sidebar, trigger);
}
