import { AgentPanel, AppShell, AppShellProvider, SlotRenderer, filterNavigationByRole } from '@convergio/starter-shared-shell';
import { shellConfig } from './config';
import { navigation } from './navigation';

const incidents = ['Latency spike · EU west', 'Worker backlog · billing-sync', 'Expired token alerts · 3 tenants'];

export function TemplatePage() {
  const allowedNav = filterNavigationByRole(navigation, ['admin', 'operator', 'executive', 'pm']);
  return (
    <AppShellProvider shell={shellConfig}>
      <AppShell
        shell={shellConfig}
        navigation={allowedNav}
        toolbar={<div className="mn-toolbar-row"><strong>Operational command center</strong><span className="mn-body-sm">Alerts, SLOs, deployments, and intervention context with a dense command surface.</span></div>}
        filterBar={<div className="mn-toolbar-row"><button type="button" className="mn-btn mn-btn--ghost">Incidents</button><button type="button" className="mn-btn mn-btn--ghost">Services</button></div>}
        executiveStrip={<div className="mn-grid-3"><SlotRenderer eyebrow="Operations" title="Open incidents"><div className="mn-title-md">3</div></SlotRenderer><SlotRenderer eyebrow="Operations" title="SLO"><div className="mn-title-md">99.92%</div></SlotRenderer><SlotRenderer eyebrow="Operations" title="Deployments"><div className="mn-title-md">7 today</div></SlotRenderer></div>}
        secondary={<SlotRenderer eyebrow="Signals" title="Incident stream"><ul className="mn-list">{incidents.map((item) => <li key={item}>{item}</li>)}</ul></SlotRenderer>}
        detail={<SlotRenderer eyebrow="Service" title="Active intervention"><p className="mn-body-sm">Keep the selected service, owner, blast radius, and remediation path visible while operators move through the dashboard.</p></SlotRenderer>}
        bottom={<SlotRenderer eyebrow="Telemetry" title="Live log rail"><p className="mn-body-sm">Bottom rail is ideal for logs, traces, and automation events.</p></SlotRenderer>}
        agent={<AgentPanel title="Operations agent" summary="Correlate incidents, summarize blast radius, and propose next actions." actions={[{ id: 'triage', label: 'Triage' }, { id: 'summarize', label: 'Summarize' }]} />}
      >
        <div className="mn-grid-2">
          <SlotRenderer eyebrow="Operations" title="Incidents"><ul className="mn-list">{incidents.map((item) => <li key={item}>{item}</li>)}</ul></SlotRenderer>
          <SlotRenderer eyebrow="Operations" title="Shell intent"><p className="mn-body-md">Metrics first, action oriented, and optimized for service health, alert triage, and response coordination.</p></SlotRenderer>
        </div>
      </AppShell>
    </AppShellProvider>
  );
}
