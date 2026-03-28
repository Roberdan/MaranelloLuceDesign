/**
 * @maranello/tokens - Barrel re-export
 * CSS variable names, theme management, event bus, locale, and utilities.
 */

export {
  SEMANTIC_COLOR,
  COLOR,
  FONT,
  TEXT_SIZE,
  SPACE,
  DURATION,
  EASE,
  RADIUS,
  SHADOW,
  SCOPE_COLOR,
  Z_INDEX,
} from './tokens';
export type { TokenName } from './tokens';

export type { ThemeMode } from './types';

export {
  BODY_CLASSES,
  THEME_ORDER,
  getTheme,
  setTheme,
  cycleTheme,
  getAccent,
} from './theme';

export { cssVar, palette } from './style';

export {
  setLocale,
  getLocale,
  resetLocale,
} from './locale';
export type { MnLocale, ResolvedMnLocale } from './locale';

export {
  debounce,
  throttle,
  formatNumber,
  formatDate,
  clamp,
  lerp,
  hiDpiCanvas,
  createElement,
  escapeHtml,
} from './utils';

export { EventBus, eventBus } from './events';
export type { EventCallback } from './events';
