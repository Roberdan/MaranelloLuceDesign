import '@convergio/design-elements/css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Program Management',
  description: 'Portfolio list, timeline thinking, executive strip, and persistent entity context.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mn-nero">{children}</body>
    </html>
  );
}
