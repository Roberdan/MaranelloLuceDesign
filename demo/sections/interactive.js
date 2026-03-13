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

  try {
    const ctrl = M.aiChat(container, {
      title: 'Fightthestroke Assistant',
      placeholder: 'Ask about programs, children, or outcomes…',
      welcomeMessage: 'Hi! I can help you with therapy programs, children outcomes, and volunteer management.',
      avatar: 'https://github.com/Roberdan.png',
      quickActions: ['Show stats', 'List programs', 'Recent outcomes'],
      onSend(text) {
        return 'This is a demo response. In production, this would connect to your AI backend. You asked: "' + text + '"';
      },
    });
    // Override panel positioning for inline demo (not fixed)
    setTimeout(() => {
      const panel = container.querySelector('.mn-chat-panel');
      const fab = container.querySelector('.mn-chat-fab');
      if (panel) {
        panel.style.position = 'absolute';
        panel.style.bottom = '0';
        panel.style.left = '0';
        panel.style.right = '0';
        panel.style.top = '0';
        panel.style.width = '100%';
        panel.style.height = '100%';
        panel.style.borderRadius = 'var(--radius-lg)';
      }
      if (fab) {
        fab.style.position = 'absolute';
        fab.style.bottom = '12px';
        fab.style.left = '12px';
      }
      container.style.position = 'relative';
      // Open + add demo messages
      if (ctrl?.open) {
        ctrl.open();
        if (ctrl.addMessage) {
          ctrl.addMessage('user', 'How many children are in the Milano program?');
          ctrl.addMessage('ai', 'The Milano early-intervention program currently supports **47 children** aged 0–6. 12 joined in the last quarter, and 3 are on the waiting list.');
        }
      }
    }, 300);
  } catch (e) {
    console.warn('[mn-chat] error:', e);
    placeholder(container, 'AI Chat');
  }
}

function initLogin(M, section) {
  const container = section.querySelector('#demo-login-screen');
  if (!container) return;

  if (!M.loginScreen) {
    placeholder(container, 'Login Screen');
    return;
  }

  try {
    M.loginScreen(container, {
      appTitle: 'Fight',
      appTitleAccent: 'Stroke',
      subtitle: 'Therapy Management Portal',
      version: 'v3.1.0',
      env: 'demo',
      buttonLabel: 'Sign in with SSO',
      checks: [
        { name: 'API Gateway', status: 'healthy' },
        { name: 'Database', status: 'healthy' },
        { name: 'ML Engine', status: 'degraded' },
      ],
      onLogin() { console.log('[mn-login] clicked'); },
    });
  } catch (e) {
    console.warn('[mn-login] error:', e);
    placeholder(container, 'Login Screen');
  }
}

function initProfile(M, section) {
  const container = section.querySelector('#demo-profile-menu');
  if (!container) return;

  if (!M.profileMenu) {
    placeholder(container, 'Profile Menu');
    return;
  }

  try {
    const trigger = document.createElement('div');
    trigger.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;padding:var(--space-xl)';
    container.innerHTML = '';
    container.appendChild(trigger);
    M.profileMenu(trigger, {
      name: 'Francesca Fedeli',
      email: 'f.fedeli@fightthestroke.org',
      avatarUrl: null,
      sections: [
        { items: [
          { label: 'View Profile', action: () => console.log('[mn-profile] View Profile') },
          { label: 'Settings', action: () => console.log('[mn-profile] Settings') },
        ]},
        { items: [
          { label: 'Switch Theme', action: () => { window.Maranello?.cycleTheme?.(); } },
          { label: 'Sign Out', action: () => console.log('[mn-profile] Sign Out') },
        ]},
      ],
    });
  } catch (e) {
    console.warn('[mn-profile] error:', e);
    placeholder(container, 'Profile Menu');
  }
}
