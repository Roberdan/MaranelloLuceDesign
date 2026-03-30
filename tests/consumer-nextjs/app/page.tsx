'use client';

import { useEffect, useRef } from 'react';
import { header, FerrariGauge, dataTable, setTheme } from '@convergio/design-elements';
import { palette } from '@convergio/design-tokens';

export default function Home() {
  const headerRef = useRef<HTMLElement>(null);
  const gaugeRef = useRef<HTMLCanvasElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      header.init(headerRef.current, {
        brand: { text: 'Smoke Test' },
        left: [{ id: 'home', label: 'Home' }],
      });
    }

    if (gaugeRef.current) {
      new FerrariGauge(gaugeRef.current, {
        value: 72,
        max: 100,
        color: palette('accent'),
      });
    }

    if (tableRef.current) {
      dataTable(tableRef.current, {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
        ],
        rows: [
          { name: 'Test Service', status: 'OK' },
          { name: 'Auth Service', status: 'OK' },
        ],
      });
    }
  }, []);

  return (
    <main>
      <nav ref={headerRef} id="smoke-header" data-testid="header" />
      <h1 data-testid="title">Consumer Smoke Test</h1>
      <div style={{ width: 200, height: 200 }}>
        <canvas ref={gaugeRef} width={200} height={200} data-testid="gauge" role="img" aria-label="Test gauge" />
      </div>
      <div ref={tableRef} data-testid="table" />
      <button data-testid="theme-btn" onClick={() => setTheme('nero')}>Nero Theme</button>
    </main>
  );
}
