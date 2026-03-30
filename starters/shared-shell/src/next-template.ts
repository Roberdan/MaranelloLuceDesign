import type { SharedShellConfig } from './contracts';

function serializeConfig(config: SharedShellConfig): string {
  return JSON.stringify(config, null, 2);
}

export function createSharedShellFiles(config: SharedShellConfig): Record<string, string> {
  const serialized = serializeConfig(config);
  return {
    'app/layout.tsx': `import type { ReactNode } from 'react';
import type { SharedShellConfig } from '../src/shared-shell/config';
import { sharedShellConfig } from '../src/shared-shell/config';

export default function RootLayout({ children }: { children: ReactNode }) {
  const config: SharedShellConfig = sharedShellConfig;
  return (
    <html lang="en">
      <body data-shell={config.appName}>
        <div id="shared-shell-root">{children}</div>
      </body>
    </html>
  );
}
`,
    'app/page.tsx': `import { sharedShellConfig } from '../src/shared-shell/config';

export default function HomePage() {
  return (
    <main>
      <h1>${config.content.title}</h1>
      <p>{sharedShellConfig.appDescription}</p>
    </main>
  );
}
`,
    'src/shared-shell/config.ts': `import type { SharedShellConfig } from '@convergio/shared-shell-starter';

export type { SharedShellConfig };
export const sharedShellConfig: SharedShellConfig = ${serialized};
`,
    'src/shared-shell/runtime.ts': `import { renderSharedShell } from '@convergio/shared-shell-starter';

export { renderSharedShell };
`,
    'app/globals.css': `:root {
  color-scheme: dark;
  --mn-surface: var(--mn-surface, #111111);
  --mn-text: var(--mn-text, #f4f4f4);
  --mn-accent: var(--mn-accent, #ffc72c);
}
`,
  };
}
