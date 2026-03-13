/**
 * Interactive Widgets section — AI Chat, Login Screen, Profile Menu demos.
 * Uses Maranello headless JS APIs with graceful fallbacks.
 */
export function createInteractiveSection() {
  const section = document.createElement('section');
  section.id = 'interactive';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">14 — Interactive Widgets</p>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Interactive Widgets</h2>
      <p class="mn-body mn-mb-2xl">
        Full-featured UI patterns: conversational AI, authentication flows, and user profile management.
      </p>

      <div class="mn-grid-3">
        <div>
          <div class="demo-section-label mn-mb-sm">AI Chat Widget</div>
          <div class="mn-card-dark" style="border-radius:var(--radius-lg);overflow:hidden">
            <div id="demo-ai-chat" style="height:350px"></div>
          </div>
        </div>
        <div>
          <div class="demo-section-label mn-mb-sm">Login Screen</div>
          <div class="mn-card-dark" style="border-radius:var(--radius-lg);overflow:hidden">
            <div id="demo-login-screen" style="min-height:350px;display:flex;align-items:center;justify-content:center"></div>
          </div>
        </div>
        <div>
          <div class="demo-section-label mn-mb-sm">Profile Menu</div>
          <div class="mn-card-dark" style="border-radius:var(--radius-lg);overflow:hidden">
            <div id="demo-profile-menu" style="min-height:350px;display:flex;align-items:center;justify-content:center"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => initInteractive(section));
  return section;
}

function placeholder(container, label) {
  container.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100%;padding:var(--space-xl)">
      <p class="mn-label" style="color:var(--grigio-medio);text-align:center">
        <strong>${label}</strong><br>
        <span class="mn-micro">Component requires JS engine</span>
      </p>
    </div>
  `;
}

function initInteractive(section) {
  const M = window.Maranello;
  if (!M) {
    ['demo-ai-chat', 'demo-login-screen', 'demo-profile-menu'].forEach(id => {
      const el = section.querySelector('#' + id);
      if (el) placeholder(el, 'Maranello not loaded');
    });
    return;
  }

  initChat(M, section);
  initLogin(M, section);
  initProfile(M, section);
}

function initChat(M, section) {
  const container = section.querySelector('#demo-ai-chat');
  if (!container) return;

  if (!M.aiChat) {
    placeholder(container, 'AI Chat');
    return;
  }

  M.aiChat(container, {
    title: 'Fightthestroke Assistant',
    placeholder: 'Ask about programs, children, or outcomes…',
    messages: [
      {
        role: 'user',
        content: 'How many children are in the Milano program?',
      },
      {
        role: 'assistant',
        content:
          'The Milano early-intervention program currently supports 47 children aged 0–6. ' +
          '12 joined in the last quarter, and 3 are on the waiting list.',
      },
    ],
    onSend(text) {
      console.log('[mn-chat] sent:', text);
    },
  });
}

function initLogin(M, section) {
  const container = section.querySelector('#demo-login-screen');
  if (!container) return;

  if (!M.loginScreen) {
    placeholder(container, 'Login Screen');
    return;
  }

  M.loginScreen(container, {
    title: 'Fightthestroke Portal',
    subtitle: 'Sign in to manage programs',
    logo: null,
    providers: [
      { name: 'Google', icon: 'google', url: '#' },
      { name: 'Microsoft', icon: 'microsoft', url: '#' },
      { name: 'Email / Password', icon: 'email', url: '#' },
    ],
    onLogin(provider) {
      console.log('[mn-login] provider:', provider);
    },
  });
}

function initProfile(M, section) {
  const container = section.querySelector('#demo-profile-menu');
  if (!container) return;

  if (!M.profileMenu) {
    placeholder(container, 'Profile Menu');
    return;
  }

  M.profileMenu(container, {
    name: 'Francesca Fedeli',
    email: 'f.fedeli@fightthestroke.org',
    avatar: null,
    role: 'Director',
    actions: [
      { label: 'View Profile', icon: 'user', action: () => console.log('[mn-profile] View Profile') },
      { label: 'Settings', icon: 'settings', action: () => console.log('[mn-profile] Settings') },
      { label: 'Switch Theme', icon: 'theme', action: () => console.log('[mn-profile] Switch Theme') },
      { label: 'Sign Out', icon: 'logout', action: () => console.log('[mn-profile] Sign Out') },
    ],
    onSignOut() {
      console.log('[mn-profile] signed out');
    },
  });
}
