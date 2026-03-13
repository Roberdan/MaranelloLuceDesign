const KPI_CARDS = [
  { value: '312', unit: 'children', label: 'Active care plans', delta: '↑ 12%', hint: 'vs. February intake' },
  { value: '87', unit: '%', label: 'Therapy adherence', delta: '↑ 4.6%', hint: 'home + center sessions' },
  { value: '14', unit: 'days', label: 'Average wait time', delta: '↓ 3 days', hint: 'from triage to first visit' },
  { value: '9.4', unit: '/10', label: 'Family confidence', delta: '↑ 0.8', hint: 'post-session survey' },
];

const CONTENT_CARDS = [
  {
    title: 'Milano early intervention sprint',
    body: 'A six-week neuro-motor program blending physiotherapy, sensory integration, and parent coaching for children aged 0–6.',
    tags: ['Milano Niguarda', 'Motor Rehab', '0–6 years'],
  },
  {
    title: 'Torino speech recovery lab',
    body: 'Intensive language and swallowing therapy supported by tele-check-ins for families travelling from outside Piemonte.',
    tags: ['Torino Regina', 'Speech', 'Hybrid care'],
  },
  {
    title: 'Bologna family resilience track',
    body: 'Weekly caregiver education, child participation metrics, and school coordination for complex post-stroke journeys.',
    tags: ['Bologna Sant’Orsola', 'Family Support', 'School bridge'],
  },
];

const ACTION_CARDS = [
  {
    icon: '↗',
    title: 'Escalate high-risk cases',
    body: 'Route children with low adherence or caregiver fatigue to the multidisciplinary board within 24 hours.',
    cta: 'Open review queue',
  },
  {
    icon: '✦',
    title: 'Launch tele-rehab pack',
    body: 'Send a branded home-program bundle with video routines, play goals, and therapist follow-up slots.',
    cta: 'Send care bundle',
  },
];

const PROFILES = [
  { name: 'Francesca Fedeli', role: 'Program Director', initials: 'FF', status: 'On site', tone: 'var(--mn-accent)' },
  { name: 'Alessio Bianchi', role: 'Lead Neuro Therapist', initials: 'AB', status: 'In session', tone: 'var(--verde-racing)' },
  { name: 'Marta Greco', role: 'Family Care Coordinator', initials: 'MG', status: 'Remote triage', tone: 'var(--status-info)' },
];

const SIGNALS = [
  { eyebrow: 'Milano Niguarda', title: 'Instrument cluster', leds: [['Intake', 'active'], ['Room load', 'warning'], ['Escalation', 'info']] },
  { eyebrow: 'Torino Regina', title: 'Hybrid therapy lane', leds: [['Tele-rehab', 'active'], ['Speech lab', 'active'], ['Consent sync', 'warning']] },
  { eyebrow: 'Bologna Sant’Orsola', title: 'Family support deck', leds: [['Caregiver coach', 'active'], ['School handoff', 'info'], ['Transport aid', 'danger']] },
];

const PODS = [
  { label: 'PT', tone: 'green' },
  { label: 'SLP', tone: 'gold' },
  { label: 'OT', tone: 'red' },
  { label: 'VR', tone: 'green' },
  { label: 'MDT', tone: 'gold' },
];

/**
 * Cards section — richer FightTheStroke card system showcase.
 */
export function createCardsSection() {
  const section = document.createElement('section');
  section.id = 'cards';
  section.className = 'mn-section-light';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">02 — Components</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Cards & Signal Surfaces</h2>
      <p class="mn-body" style="margin-bottom:var(--space-xl)">
        A richer, extended card gallery for FightTheStroke therapy centers: KPI tiles, operational media, therapist profiles,
        and dashboard micro-panels built to feel cinematic but still highly readable.
      </p>

      <div class="mn-tag-group" style="justify-content:center;margin-bottom:var(--space-2xl)">
        <span class="mn-tag mn-tag--active">FightTheStroke</span>
        <span class="mn-tag">Therapy Centers</span>
        <span class="mn-tag">Hybrid Care</span>
        <span class="mn-tag">Family Outcomes</span>
        <span class="mn-tag mn-tag--xs">dashboard</span>
      </div>

      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">KPI stat cards</h3>
      <div class="mn-grid-4" style="margin-bottom:var(--space-2xl)">${KPI_CARDS.map(statCard).join('')}</div>

      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Content cards</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${CONTENT_CARDS.map(contentCard).join('')}</div>

      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Media & actions</h3>
      <div class="mn-grid-2" style="margin-bottom:var(--space-2xl)">
        ${videoCard()}
        <div style="display:grid;gap:var(--space-lg)">${ACTION_CARDS.map(actionCard).join('')}</div>
      </div>

      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Therapist profiles</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${PROFILES.map(profileCard).join('')}</div>

      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Signal panels</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${SIGNALS.map(signalCard).join('')}</div>

      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Pod group strip</h3>
      <div class="mn-grid-2">
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;gap:var(--space-md);align-items:flex-start;flex-wrap:wrap;margin-bottom:var(--space-lg)">
            <div>
              <div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-xs)">Care pod strip</div>
              <p class="mn-card__text">Small pods summarise the multidisciplinary stack running in the Milano center today.</p>
            </div>
            <span class="mn-tag mn-tag--light mn-tag--xs">5 active pods</span>
          </div>
          <div class="mn-pod-group" style="justify-content:center;padding:var(--space-lg) 0 var(--space-xl)">${PODS.map(pod).join('')}</div>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-xl);display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">Session handoff card</div>
            <h4 class="mn-card__title" style="font-size:var(--text-h4)">Afternoon flow / Milano & Torino</h4>
            <p class="mn-card__text" style="margin-bottom:var(--space-lg)">
              18 follow-up sessions, 4 first assessments, and 2 family escalation reviews need synchronized transport, room prep, and clinician coverage.
            </p>
          </div>
          <div style="display:flex;justify-content:space-between;gap:var(--space-md);align-items:flex-end;flex-wrap:wrap">
            <div>
              <div class="mn-micro" style="color:var(--grigio-chiaro)">Readiness</div>
              <div style="font-family:var(--font-display);font-size:var(--text-h2);color:var(--mn-accent);line-height:1">91%</div>
            </div>
            <button class="mn-btn mn-btn--accent">Dispatch schedule</button>
          </div>
        </div>
      </div>
    </div>
  `;
  return section;
}

function statCard(item) {
  return `
    <div class="mn-card-dark" style="padding:var(--space-xl)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-sm);margin-bottom:var(--space-md)">
        <span class="mn-tag mn-tag--light mn-tag--xs">${item.hint}</span>
        <span class="mn-micro" style="color:${item.delta.includes('↓') ? 'var(--rosso-corsa)' : 'var(--verde-racing)'}">${item.delta}</span>
      </div>
      <div class="mn-stat">
        <div class="mn-stat__value">${item.value}</div>
        <div class="mn-stat__unit">${item.unit}</div>
        <div class="mn-stat__label">${item.label}</div>
      </div>
    </div>`;
}

function contentCard(item) {
  return `
    <article class="mn-card-dark">
      <div class="mn-card__content">
        <div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">Program card</div>
        <h4 class="mn-card__title" style="font-size:var(--text-h4)">${item.title}</h4>
        <p class="mn-card__text" style="margin-bottom:var(--space-lg)">${item.body}</p>
        <footer class="mn-tag-group">${item.tags.map((tag) => `<span class="mn-tag mn-tag--light mn-tag--xs">${tag}</span>`).join('')}</footer>
      </div>
    </article>`;
}

function videoCard() {
  return `
    <article class="mn-card-dark" style="padding:var(--space-lg)">
      <div class="mn-video-card" style="background:
        linear-gradient(135deg, rgba(255,199,44,0.22), rgba(220,0,0,0.18)),
        radial-gradient(circle at 24% 20%, rgba(255,255,255,0.16), transparent 34%),
        linear-gradient(160deg, #1f1f1f, #0a0a0a 72%);margin-bottom:var(--space-lg)">
        <span class="mn-tag mn-tag--light mn-tag--xs" style="position:absolute;top:var(--space-md);right:var(--space-md)">04:32</span>
        <span class="mn-video-card__play"></span>
        <span class="mn-video-card__label">Watch rehab walkthrough</span>
      </div>
      <div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">mn-video-card</div>
      <h4 class="mn-card__title" style="font-size:var(--text-h4)">Milano sensory gym / warm-up protocol</h4>
      <p class="mn-card__text">Gradient media placeholder for center tours, staff instructions, or caregiver explainers.</p>
    </article>`;
}

function actionCard(item) {
  return `
    <article class="mn-card-dark" style="padding:var(--space-xl)">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-md);margin-bottom:var(--space-md)">
        <div>
          <div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-xs)">Action card</div>
          <h4 class="mn-card__title" style="font-size:var(--text-h4);margin-bottom:var(--space-xs)">${item.title}</h4>
        </div>
        <span style="width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,0.06);font-size:1.1rem">${item.icon}</span>
      </div>
      <p class="mn-card__text" style="margin-bottom:var(--space-lg)">${item.body}</p>
      <button class="mn-btn mn-btn--accent">${item.cta}</button>
    </article>`;
}

function profileCard(item) {
  return `
    <article class="mn-card-dark" style="padding:var(--space-xl)">
      <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md)">
        <div style="width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:${item.tone};color:#111;font-family:var(--font-display);font-weight:700">${item.initials}</div>
        <div>
          <h4 class="mn-card__title" style="font-size:var(--text-h5);margin-bottom:2px">${item.name}</h4>
          <p class="mn-card__text">${item.role}</p>
        </div>
      </div>
      <div class="mn-status mn-status--active"><span class="mn-status__dot"></span>${item.status}</div>
    </article>`;
}

function signalCard(item) {
  return `
    <div class="mn-signal-panel">
      <div class="mn-signal-panel__eyebrow">${item.eyebrow}</div>
      <div class="mn-signal-panel__title" style="margin-bottom:var(--space-md)">${item.title}</div>
      <div style="display:grid;gap:var(--space-sm)">${item.leds.map(([label, status]) => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-md)">
          <span class="mn-micro" style="color:var(--grigio-chiaro)">${label}</span>
          <span class="mn-status mn-status--${status} mn-status--sm"><span class="mn-status__dot"></span>${status}</span>
        </div>`).join('')}
      </div>
    </div>`;
}

function pod(item) {
  return `
    <div class="mn-pod">
      <div class="mn-pod__face"><span class="mn-pod__indicator mn-pod__indicator--${item.tone}"></span></div>
      <div class="mn-pod__label">${item.label}</div>
    </div>`;
}
