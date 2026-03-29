export interface AuthSession {
  userId: string;
  displayName: string;
  roles: string[];
}

export function createMockSession(overrides: Partial<AuthSession> = {}): AuthSession {
  return {
    userId: overrides.userId || 'demo-user',
    displayName: overrides.displayName || 'Demo Operator',
    roles: overrides.roles ? overrides.roles.slice() : ['admin'],
  };
}
