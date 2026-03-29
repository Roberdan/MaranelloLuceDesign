import type { NavigationSchema } from '@convergio/starter-shared-shell';

export const navigation: NavigationSchema = {
  primary: [
    { id: 'overview', label: 'Overview', href: '#overview', roles: ['admin', 'operator', 'executive', 'pm'] },
    { id: 'work', label: 'Work', href: '#work', roles: ['admin', 'operator', 'pm'] },
    { id: 'insights', label: 'Insights', href: '#insights', roles: ['admin', 'executive'] },
    { id: 'settings', label: 'Settings', href: '#settings', roles: ['admin'] },
  ],
};
