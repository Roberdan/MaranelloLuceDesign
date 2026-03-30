'use client';

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import('@convergio/design-elements/register-all').then(m => m.registerAll());
  }, []);
  return <>{children}</>;
}
