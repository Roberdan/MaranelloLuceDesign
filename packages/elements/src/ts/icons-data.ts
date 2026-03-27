/**
 * Maranello Luce Design - Data visualization & chart icons
 */
import { svg } from './icon-svg';

export const dataIcons = {
  gauge: () => svg('<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12"/><path d="M12 12l4-8"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'),
  trendUp: () => svg('<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'),
  trendDown: () => svg('<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>'),
  barChart: () => svg('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
  toggleOn: () => svg('<rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="4" fill="currentColor"/>'),
  toggleOff: () => svg('<rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="4"/>'),
  kpi: () => svg('<path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/><circle cx="12" cy="7" r="2"/><circle cx="18" cy="2" r="1" fill="currentColor"/>'),
  impact: () => svg('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'),
  pipeline: () => svg('<rect x="2" y="3" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="16" y="15" width="6" height="6" rx="1"/><path d="M8 6h1l3 3"/><path d="M15 12h1l3 3"/>'),
  orgChart: () => svg('<rect x="8" y="2" width="8" height="4" rx="1"/><rect x="2" y="18" width="6" height="4" rx="1"/><rect x="9" y="18" width="6" height="4" rx="1"/><rect x="16" y="18" width="6" height="4" rx="1"/><line x1="12" y1="6" x2="12" y2="14"/><line x1="5" y1="14" x2="19" y2="14"/><line x1="5" y1="14" x2="5" y2="18"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="19" y1="14" x2="19" y2="18"/>'),
  treeView: () => svg('<line x1="6" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="6" y1="18" x2="10" y2="18"/><rect x="10" y="3" width="10" height="6" rx="1"/><rect x="10" y="9" width="10" height="6" rx="1"/><rect x="10" y="15" width="10" height="6" rx="1"/>'),
} as const;
