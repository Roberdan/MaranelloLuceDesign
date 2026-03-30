import type { Metadata } from 'next';
import '@convergio/design-tokens/css';
import '@convergio/design-elements/css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Consumer Smoke Test',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
