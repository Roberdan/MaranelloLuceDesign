import '@convergio/design-elements/css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Executive Cockpit',
  description: 'High-signal overview, portfolio health, and narrative drill-down surfaces.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mn-editorial">{children}</body>
    </html>
  );
}
