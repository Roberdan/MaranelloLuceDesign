/**
 * Maranello Luce Design - Navigation & arrow icons
 */
import { svg } from './icon-svg';

export const navIcons = {
  dashboard: () => svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>'),
  home: () => svg('<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>'),
  menu: () => svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'),
  chevronRight: () => svg('<polyline points="9 18 15 12 9 6"/>'),
  chevronDown: () => svg('<polyline points="6 9 12 15 18 9"/>'),
  chevronLeft: () => svg('<polyline points="15 18 9 12 15 6"/>'),
  chevronUp: () => svg('<polyline points="18 15 12 9 6 15"/>'),
  arrowUp: () => svg('<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>'),
  arrowDown: () => svg('<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>'),
  arrowLeft: () => svg('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'),
  arrowRight: () => svg('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'),
  externalLink: () => svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'),
  sidebar: () => svg('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>'),
  panelRight: () => svg('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/>'),
  columns: () => svg('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>'),
  maximize: () => svg('<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>'),
  minimize: () => svg('<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>'),
  expand: () => svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>'),
  collapse: () => svg('<circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>'),
  funnel: () => svg('<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>'),
  gantt: () => svg('<rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="12" height="4" rx="1"/><rect x="3" y="17" width="15" height="4" rx="1"/>'),
  table: () => svg('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'),
  heatmap: () => svg('<rect x="2" y="2" width="6" height="6" rx="0.5"/><rect x="9" y="2" width="6" height="6" rx="0.5"/><rect x="16" y="2" width="6" height="6" rx="0.5"/><rect x="2" y="9" width="6" height="6" rx="0.5"/><rect x="9" y="9" width="6" height="6" rx="0.5"/><rect x="16" y="9" width="6" height="6" rx="0.5"/><rect x="2" y="16" width="6" height="6" rx="0.5"/><rect x="9" y="16" width="6" height="6" rx="0.5"/><rect x="16" y="16" width="6" height="6" rx="0.5"/>'),
  grid: () => svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
} as const;
