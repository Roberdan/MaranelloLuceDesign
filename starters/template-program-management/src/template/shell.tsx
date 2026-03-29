import { AgentPanel, AppShell, AppShellProvider, SlotRenderer, filterNavigationByRole } from '@convergio/starter-shared-shell';
import { shellConfig } from './config';
import { navigation } from './navigation';

const programs = [
  'Microsoft Corporation — ANZ Studio Internal',
  'Telstra — Autonomous Networks',
  'Westpac — Live Co-engineering',
];

export function TemplatePage() {
  const allowedNav = filterNavigationByRole(navigation, ['admin', 'operator', 'executive', 'pm']);
  return (
    <AppShellProvider shell={shellConfig}>
      <AppShell
        shell={shellConfig}
        navigation={allowedNav}
        toolbar={<div className="mn-toolbar-row"><strong>Program delivery board</strong><span className="mn-body-sm">Portfolio list, timeline thinking, executive strip, and persistent entity context.</span></div>}
        filterBar={<div className="mn-toolbar-row"><button type="button" className="mn-btn mn-btn--ghost">Portfolio</button><button type="button" className="mn-btn mn-btn--ghost">Timeline</button></div>}
        executiveStrip={<div className="mn-grid-3"><SlotRenderer eyebrow="Program Management" title="Prospects"><div className="mn-title-md">44</div></SlotRenderer><SlotRenderer eyebrow="Program Management" title="In flight"><div className="mn-title-md">93</div></SlotRenderer><SlotRenderer eyebrow="Program Management" title="Closed"><div className="mn-title-md">137</div></SlotRenderer></div>}
        secondary={<SlotRenderer eyebrow="Board" title="Portfolio queue"><ul className="mn-list">{programs.map((item) => <li key={item}>{item}</li>)}</ul></SlotRenderer>}
        detail={<SlotRenderer eyebrow="Entity" title="Persistent detail panel"><p className="mn-body-sm">The selected account, owner, state, and narrative context stay pinned while the timeline board remains visible.</p></SlotRenderer>}
        bottom={<SlotRenderer eyebrow="Activity" title="Delivery rail"><p className="mn-body-sm">Ideal for comments, updates, and telemetry related to the selected program.</p></SlotRenderer>}
        agent={<AgentPanel title="Program agent" summary="Summarize portfolio health, identify slippage, and draft follow-ups for delivery leaders." actions={[{ id: 'summarize', label: 'Summarize portfolio' }, { id: 'risks', label: 'Highlight risks' }]} />}
      >
        <div className="mn-grid-2">
          <SlotRenderer eyebrow="Program Management" title="Program list"><ul className="mn-list">{programs.map((item) => <li key={item}>{item}</li>)}</ul></SlotRenderer>
          <SlotRenderer eyebrow="Program Management" title="Timeline board"><p className="mn-body-md">This starter is intentionally shaped like a Virtual BPM-style shell: top command rail, KPI strip, list-plus-board center, and persistent detail context.</p></SlotRenderer>
        </div>
      </AppShell>
    </AppShellProvider>
  );
}
