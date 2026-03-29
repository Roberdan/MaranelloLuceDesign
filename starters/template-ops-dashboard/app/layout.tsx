import '@convergio/design-elements/css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ops Dashboard',
  description: 'Alerts, SLOs, deployments, and intervention context with a dense command surface.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mn-navy">{children}</body>
    </html>
  );
}
