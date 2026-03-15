/**
 * Maranello Luce Design - Login screen component
 * Generic SSO login screen with system health display.
 */

import { createElement } from './core/utils';
import { compassSVG, createServiceCard } from './login-dom';
import type { LoginServiceCheck } from './login-dom';

export type { LoginServiceCheck } from './login-dom';

export interface LoginHealthData {
  checks?: LoginServiceCheck[];
  error?: string | null;
}

export interface LoginScreenOptions {
  subtitle?: string;
  version?: string;
  env?: string;
  error?: string | null;
  checks?: LoginServiceCheck[] | null;
  onLogin?: (event: MouseEvent) => void;
  healthUrl?: string;
  autoHealth?: boolean;
  pollInterval?: number;
  /** Label for the login button (default: "Sign in with SSO") */
  buttonLabel?: string;
  /** Application title (default: "Maranello") */
  appTitle?: string;
  /** Title accent text (default: "Luce") */
  appTitleAccent?: string;
  /** Whether to show the system status section (default: true) */
  showStatus?: boolean;
}

export interface LoginScreenController {
  updateStatus: (healthData: LoginHealthData | null | undefined) => void;
  setError: (msg: string | null) => void;
  destroy: () => void;
}

interface LoginState {
  subtitle?: string;
  version?: string;
  env?: string;
  error: string | null;
  checks: LoginServiceCheck[] | null;
  onLogin: ((event: MouseEvent) => void) | null;
}

function render(container: HTMLElement, state: LoginState, opts: LoginScreenOptions): void {
  container.innerHTML = '';
  const root = createElement('div', 'mn-login');
  root.appendChild(createElement('div', 'mn-login__glow'));

  const card = createElement('div', 'mn-login__card');
  const logoWrap = createElement('div', 'mn-login__logo');
  logoWrap.innerHTML = compassSVG(80);
  card.appendChild(logoWrap);

  const title = createElement('h1', 'mn-login__title', { text: opts.appTitle ?? 'Maranello' });
  title.appendChild(createElement('span', 'mn-login__title-accent', { text: opts.appTitleAccent ?? 'Luce' }));
  card.appendChild(title);

  card.appendChild(createElement('p', 'mn-login__subtitle', {
    text: state.subtitle ?? 'Design System',
  }));

  const btn = createElement('button', 'mn-login__btn');
  btn.type = 'button';
  btn.appendChild(createElement('span', '', { text: opts.buttonLabel ?? 'Sign in with SSO' }));
  if (state.onLogin) btn.addEventListener('click', state.onLogin);
  card.appendChild(btn);

  if (state.error) {
    card.appendChild(createElement('div', 'mn-login__error', { text: state.error }));
    const errorEl = card.lastElementChild as HTMLElement;
    errorEl.setAttribute('role', 'alert');
  }

  if (opts.showStatus !== false) {
    const statusSection = createElement('div', 'mn-login__status');
    statusSection.appendChild(createElement('div', 'mn-login__status-title', { text: 'SYSTEM STATUS' }));

    const gaugeRow = createElement('div', 'mn-login__status-gauges');
    if (state.checks?.length) {
      state.checks.forEach((c) => gaugeRow.appendChild(createServiceCard(c)));
    } else {
      ['Database', 'Cache', 'API'].forEach((name) => {
        gaugeRow.appendChild(createServiceCard({ name, status: 'healthy', latency_ms: null }));
      });
    }
    statusSection.appendChild(gaugeRow);

    let overall = 'healthy';
    if (state.checks) {
      for (const c of state.checks) {
        if (c.status === 'unhealthy') { overall = 'unhealthy'; break; }
        if (c.status === 'degraded' && overall !== 'unhealthy') overall = 'degraded';
      }
    }
    statusSection.appendChild(createElement('div', `mn-login__overall mn-login__overall--${overall}`, {
      text: overall === 'healthy' ? 'All systems operational'
        : overall === 'degraded' ? 'Some services degraded'
        : 'Service disruption detected',
    }));
    card.appendChild(statusSection);
  }

  const footer = createElement('div', 'mn-login__footer');
  footer.appendChild(createElement('span', 'mn-login__version', { text: state.version ?? '' }));
  const envValue = state.env ?? 'production';
  footer.appendChild(createElement('span', `mn-login__env mn-login__env--${envValue}`, {
    text: state.env ?? 'Production',
  }));
  card.appendChild(footer);

  root.appendChild(card);
  container.appendChild(root);
}

/**
 * Create a login screen with optional system health polling.
 */
export function loginScreen(
  container: string | HTMLElement,
  opts?: LoginScreenOptions,
): LoginScreenController | null {
  const host = typeof container === 'string' ? document.querySelector<HTMLElement>(container) : container;
  if (!host) return null;

  const options = opts ?? {};
  const state: LoginState = {
    subtitle: options.subtitle,
    version: options.version,
    env: options.env,
    error: options.error ?? null,
    checks: options.checks ?? null,
    onLogin: options.onLogin ?? null,
  };

  render(host, state, options);
  let disposed = false;
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  function fetchHealth(): void {
    if (disposed) return;
    const url = options.healthUrl ?? '/api/health/deep';
    fetch(url, { credentials: 'same-origin' })
      .then((r) => (r.ok ? (r.json() as Promise<LoginHealthData>) : Promise.resolve(null)))
      .then((data) => {
        if (data?.checks) {
          state.checks = data.checks;
          render(host!, state, options);
        }
      })
      .catch((err: unknown) => {
        console.warn('[Maranello] loginScreen: health fetch failed:', err);
      });
  }

  if (options.autoHealth !== false && typeof fetch !== 'undefined') {
    fetchHealth();
    pollTimer = setInterval(fetchHealth, options.pollInterval ?? 30000);
  }

  return {
    updateStatus(healthData) {
      if (disposed) return;
      if (healthData?.checks) state.checks = healthData.checks;
      if (healthData?.error) state.error = healthData.error;
      render(host!, state, options);
    },
    setError(msg) {
      if (disposed) return;
      state.error = msg;
      render(host!, state, options);
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      if (pollTimer) clearInterval(pollTimer);
      host!.innerHTML = '';
    },
  };
}
