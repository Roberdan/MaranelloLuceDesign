import { AgentPanel, AppShell, AppShellProvider, SlotRenderer, filterNavigationByRole } from '@convergio/starter-shared-shell';
import { shellConfig } from './config';
import { navigation } from './navigation';

const tasks = ['Approve rollout checklist', 'Review API usage spike', 'Confirm account owner handoff'];

export function TemplatePage() {
  const allowedNav = filterNavigationByRole(navigation, ['admin', 'operator', 'executive', 'pm']);
  return (
    <AppShellProvider shell={shellConfig}>
      <AppShell
        shell={shellConfig}
        navigation={allowedNav}
        toolbar={<div className="mn-toolbar-row"><strong>Team workspace</strong><span className="mn-body-sm">Project switcher, tasks, approvals, and a persistent activity panel.</span></div>}
        filterBar={<div className="mn-toolbar-row"><button type="button" className="mn-btn mn-btn--ghost">My work</button><button type="button" className="mn-btn mn-btn--ghost">Approvals</button></div>}
        executiveStrip={<div className="mn-grid-3"><SlotRenderer eyebrow="Workspace" title="Tasks due"><div className="mn-title-md">12</div></SlotRenderer><SlotRenderer eyebrow="Workspace" title="Approvals"><div className="mn-title-md">4</div></SlotRenderer><SlotRenderer eyebrow="Workspace" title="Blocked"><div className="mn-title-md">1</div></SlotRenderer></div>}
        secondary={<SlotRenderer eyebrow="Activity" title="Recent moves"><ul className="mn-list">{tasks.map((task) => <li key={task}>{task}</li>)}</ul></SlotRenderer>}
        detail={<SlotRenderer eyebrow="Context" title="Focused record"><p className="mn-body-sm">Keep account, owner, and approval context visible while users work across views.</p></SlotRenderer>}
        bottom={<SlotRenderer eyebrow="Collaboration" title="Docked stream"><p className="mn-body-sm">A workspace shell benefits from comments, audit logs, and agent suggestions in a bottom rail.</p></SlotRenderer>}
        agent={<AgentPanel title="Workspace agent" summary="Summaries, drafting, and follow-up suggestions scoped to the current user context." actions={[{ id: 'summarize', label: 'Summarize' }, { id: 'draft', label: 'Draft reply' }]} />}
      >
        <div className="mn-grid-2">
          <SlotRenderer eyebrow="Workspace" title="Execution queue"><ul className="mn-list">{tasks.map((task) => <li key={task}>{task}</li>)}</ul></SlotRenderer>
          <SlotRenderer eyebrow="Workspace" title="Why this shell exists"><p className="mn-body-md">A general business shell with persistent nav, detail context, and enough density to handle internal tools without becoming a dashboard collage.</p></SlotRenderer>
        </div>
      </AppShell>
    </AppShellProvider>
  );
}
