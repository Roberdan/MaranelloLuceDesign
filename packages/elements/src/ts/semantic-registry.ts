/**
 * Semantic Registry — maps workflows to Convergio components and starters.
 * Agents and humans query this to find the right components for a use case.
 */
import { WORKFLOWS } from './semantic-registry-data';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ComponentRef {
  id: string;
  role: string;
  importPath?: string;
}

export interface StarterRef {
  package: string;
  description: string;
  entryFunction?: string;
}

export interface WorkflowEntry {
  workflow: string;
  label: string;
  description: string;
  components: ComponentRef[];
  compositionRules: string[];
  layout: string;
  tags: string[];
  starter?: StarterRef;
  dataShapes?: string[];
}

export interface SemanticQuery {
  keywords: string[];
  dataShape?: string;
}

export interface SemanticResult extends WorkflowEntry {
  score: number;
}

/* ------------------------------------------------------------------ */
/*  Lookup by workflow ID                                              */
/* ------------------------------------------------------------------ */

const workflowIndex = new Map<string, WorkflowEntry>();
for (const wf of WORKFLOWS) {
  workflowIndex.set(wf.workflow, wf);
}

export function queryByWorkflow(id: string): WorkflowEntry | undefined {
  return workflowIndex.get(id);
}

/* ------------------------------------------------------------------ */
/*  Intent-based search                                                */
/* ------------------------------------------------------------------ */

export function queryByIntent(query: SemanticQuery): SemanticResult[] {
  const kw = query.keywords.map(k => k.toLowerCase());
  const results: SemanticResult[] = [];

  for (const wf of WORKFLOWS) {
    let score = 0;
    const searchable = [
      ...wf.tags,
      wf.workflow,
      wf.label.toLowerCase(),
      wf.description.toLowerCase(),
    ].join(' ');

    for (const k of kw) {
      if (searchable.includes(k)) score += 1;
    }

    if (query.dataShape && wf.dataShapes) {
      if (wf.dataShapes.includes(query.dataShape)) score += 1;
    }

    if (score > 0) {
      results.push({ ...wf, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

/* ------------------------------------------------------------------ */
/*  List all workflows                                                 */
/* ------------------------------------------------------------------ */

export function listWorkflows(): Array<{
  id: string;
  label: string;
  description: string;
}> {
  return WORKFLOWS.map(wf => ({
    id: wf.workflow,
    label: wf.label,
    description: wf.description,
  }));
}

/* ------------------------------------------------------------------ */
/*  Get starter template for a workflow                                */
/* ------------------------------------------------------------------ */

export function getStarterForWorkflow(
  id: string,
): StarterRef | undefined {
  return workflowIndex.get(id)?.starter;
}
