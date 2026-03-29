import '@convergio/design-elements/css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace App',
  description: 'Project switcher, tasks, approvals, and a persistent activity panel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mn-nero">{children}</body>
    </html>
  );
}
