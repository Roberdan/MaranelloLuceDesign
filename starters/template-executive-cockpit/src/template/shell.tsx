import { AgentPanel, AppShell, AppShellProvider, SlotRenderer, filterNavigationByRole } from '@convergio/starter-shared-shell';
import { shellConfig } from './config';
import { navigation } from './navigation';

const decisions = ['Budget reallocation', 'Program risk acceptance', 'Vendor consolidation'];

export function TemplatePage() {
  const allowedNav = filterNavigationByRole(navigation, ['admin', 'operator', 'executive', 'pm']);
  return (
    <AppShellProvider shell={shellConfig}>
      <AppShell
        shell={shellConfig}
        navigation={allowedNav}
        toolbar={<div className="mn-toolbar-row"><strong>Leadership cockpit</strong><span className="mn-body-sm">High-signal overview, portfolio health, and narrative drill-down surfaces.</span></div>}
        filterBar={<div className="mn-toolbar-row"><button type="button" className="mn-btn mn-btn--ghost">Portfolio</button><button type="button" className="mn-btn mn-btn--ghost">Scenarios</button></div>}
        executiveStrip={<div className="mn-grid-3"><SlotRenderer eyebrow="Executive" title="Growth"><div className="mn-title-md">+18%</div></SlotRenderer><SlotRenderer eyebrow="Executive" title="Margin"><div className="mn-title-md">31%</div></SlotRenderer><SlotRenderer eyebrow="Executive" title="Risk"><div className="mn-title-md">Moderate</div></SlotRenderer></div>}
        secondary={<SlotRenderer eyebrow="Narrative" title="Decision queue"><ul className="mn-list">{decisions.map((item) => <li key={item}>{item}</li>)}</ul></SlotRenderer>}
        detail={<SlotRenderer eyebrow="Portfolio" title="Decision context"><p className="mn-body-sm">Keep strategy, owner, financial impact, and supporting narrative visible without losing the overview.</p></SlotRenderer>}
        bottom={<SlotRenderer eyebrow="Board prep" title="Support rail"><p className="mn-body-sm">Bottom rail can host commentary, board notes, and supporting materials.</p></SlotRenderer>}
        agent={<AgentPanel title="Executive agent" summary="Summarize trade-offs, draft talking points, and surface follow-up actions." actions={[{ id: 'brief', label: 'Brief board' }, { id: 'compare', label: 'Compare scenarios' }]} />}
      >
        <div className="mn-grid-2">
          <SlotRenderer eyebrow="Executive" title="Decision stack"><ul className="mn-list">{decisions.map((item) => <li key={item}>{item}</li>)}</ul></SlotRenderer>
          <SlotRenderer eyebrow="Executive" title="Shell intent"><p className="mn-body-md">A compact leadership shell for high-signal review, narrative context, and decisive drill-down rather than operational detail overload.</p></SlotRenderer>
        </div>
      </AppShell>
    </AppShellProvider>
  );
}
