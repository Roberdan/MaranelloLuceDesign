import { NextResponse } from 'next/server';
import { createAgentReply, createAgentRequestContext } from '@convergio/starter-shared-shell/server/ai/route';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const context = createAgentRequestContext({
    userId: 'demo-user',
    roles: ['admin', 'operator', 'pm'],
    featureFlags: { agentPanel: true },
  });
  const prompt = typeof body.prompt === 'string' ? body.prompt : '';
  return NextResponse.json(createAgentReply(prompt, context));
}
