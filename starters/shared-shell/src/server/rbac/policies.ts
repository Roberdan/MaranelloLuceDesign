export interface RbacPolicy {
  id: string;
  label: string;
  roles: string[];
}

export const defaultPolicies: RbacPolicy[] = [
  { id: 'view-dashboard', label: 'View dashboard', roles: ['admin', 'operator', 'executive'] },
  { id: 'view-programs', label: 'View program board', roles: ['admin', 'pm', 'executive'] },
  { id: 'run-agent-actions', label: 'Run AI actions', roles: ['admin', 'operator', 'pm'] },
];

export function hasPolicy(roles: string[], policyId: string): boolean {
  const policy = defaultPolicies.find((item) => item.id === policyId);
  if (!policy) return false;
  return policy.roles.some((role) => roles.includes(role));
}
