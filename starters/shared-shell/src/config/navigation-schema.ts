export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  section?: string;
  roles?: string[];
  badge?: string;
}

export interface NavigationSchema {
  primary: NavigationItem[];
  secondary?: NavigationItem[];
}

export function filterNavigationByRole(
  schema: NavigationSchema,
  roles: string[],
): NavigationSchema {
  const visible = (item: NavigationItem): boolean => {
    if (!item.roles || !item.roles.length) return true;
    return item.roles.some((role) => roles.includes(role));
  };

  return {
    primary: schema.primary.filter(visible),
    secondary: (schema.secondary || []).filter(visible),
  };
}
