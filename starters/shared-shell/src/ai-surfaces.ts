export interface AISuggestion {
  id: string;
  label: string;
  description?: string;
  actionId: string;
}

export interface AICommandPalette {
  hotkey: string;
  placeholder: string;
  suggestions: AISuggestion[];
}

export interface AIPanel {
  position: 'right' | 'bottom';
  defaultOpen: boolean;
  title: string;
}

export interface AIActionSurface {
  id: string;
  label: string;
  serverRoute: string;
  method: 'GET' | 'POST';
  bodySchema?: string;
}

export interface AICommandSurfaces {
  palette: AICommandPalette;
  panel?: AIPanel;
  actions: AIActionSurface[];
}

export function createDefaultAISurfaces(): AICommandSurfaces {
  return {
    palette: {
      hotkey: 'cmd+k',
      placeholder: 'Ask the agent or search commands...',
      suggestions: [
        {
          id: 'palette-summarize',
          label: 'Summarize current view',
          description: 'Generate a concise summary of what is on screen',
          actionId: 'summarize',
        },
        {
          id: 'palette-analyze',
          label: 'Analyze data',
          description: 'Run a structured analysis on visible data',
          actionId: 'analyze',
        },
        {
          id: 'palette-suggest',
          label: 'Suggest next actions',
          description: 'Get recommended follow-up actions from the agent',
          actionId: 'suggest',
        },
      ],
    },
    panel: {
      position: 'right',
      defaultOpen: false,
      title: 'Agent',
    },
    actions: [
      {
        id: 'summarize',
        label: 'Summarize',
        serverRoute: '/api/agent/summarize',
        method: 'POST',
        bodySchema: '{ "context": "string", "scope": "string" }',
      },
      {
        id: 'analyze',
        label: 'Analyze',
        serverRoute: '/api/agent/analyze',
        method: 'POST',
        bodySchema: '{ "data": "unknown", "intent": "string" }',
      },
      {
        id: 'suggest',
        label: 'Suggest actions',
        serverRoute: '/api/agent/suggest',
        method: 'POST',
        bodySchema: '{ "context": "string" }',
      },
    ],
  };
}
