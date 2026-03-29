export interface AgentRouteConfig {
  runtime: 'nodejs';
  maxDuration: number;
  provider: 'vercel-ai-sdk';
}

export const agentRouteConfig: AgentRouteConfig = {
  runtime: 'nodejs',
  maxDuration: 30,
  provider: 'vercel-ai-sdk',
};

export interface AgentRequestContext {
  userId: string;
  roles: string[];
  featureFlags: Record<string, boolean>;
}

export interface AgentReply {
  provider: AgentRouteConfig['provider'];
  message: string;
  nextActions: string[];
}

export function createAgentRequestContext(input: AgentRequestContext): AgentRequestContext {
  return {
    userId: input.userId,
    roles: input.roles.slice(),
    featureFlags: { ...input.featureFlags },
  };
}

export function createAgentReply(prompt: string, context: AgentRequestContext): AgentReply {
  const trimmed = prompt.trim() || 'Summarize current state';
  return {
    provider: agentRouteConfig.provider,
    message: `Stub reply for "${trimmed}" scoped to ${context.roles.join(', ') || 'no-role'} in ${context.userId}.`,
    nextActions: ['Summarize', 'Prioritize', 'Draft action plan'],
  };
}
