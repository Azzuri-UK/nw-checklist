'use client';
import React from 'react';

export default function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-3 w-full rounded-xl overflow-hidden" style={{ background: '#1a1a1a', boxShadow: 'inset 0 0 0 1px #2a2518' }}>
      <div className="h-full" style={{ width: `${pct}%`, background: '#c8a74e' }} />
    </div>
  );
}
