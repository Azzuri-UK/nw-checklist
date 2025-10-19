'use client';
import React from 'react';

export default function QuantityControls({
  count,
  max,
  onDec,
  onInc,
  onSetMax,
}: {
  count: number;
  max: number;
  onDec: () => void;
  onInc: () => void;
  onSetMax: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onDec} className="rounded-lg px-2 py-1 border" style={{ borderColor: '#2a2518', background: '#0f0e0b' }} aria-label="Decrement">−</button>
      <div className="text-sm tabular-nums" title="Completed / Daily limit">{count} / {max}</div>
      <button onClick={onInc} className="rounded-lg px-2 py-1 border" style={{ borderColor: '#2a2518', background: '#0f0e0b' }} aria-label="Increment">+</button>
    </div>
  );
}
