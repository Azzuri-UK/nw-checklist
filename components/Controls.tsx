'use client';
import React from 'react';
import { Category } from '@/lib/types';
import { DEFAULT_ORDER } from '@/lib/presets';

interface Props {
  categories: Category[];
  newTitle: string;
  newCategory: Category | string;
  onTitleChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onAdd: () => void;
  filter: string;
  onFilterChange: (v: string) => void;
}

export default function Controls({
  categories,
  newTitle,
  newCategory,
  onTitleChange,
  onCategoryChange,
  onAdd,
  filter,
  onFilterChange,
}: Props) {
  const parchment = '#f1e9d2';
  const gold = '#c8a74e';

  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          className="md:col-span-3 rounded-2xl border px-4 py-3 outline-none focus:ring-2"
          style={{ background: '#141414', borderColor: '#2a2518', color: parchment }}
          placeholder={`Add a task (e.g., "Topaz potion")`}
          value={newTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
        />
        <select
          className="md:col-span-1 rounded-2xl border px-3 py-3 outline-none focus:ring-2"
          style={{ background: '#141414', borderColor: '#2a2518', color: parchment }}
          value={newCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          {!categories.includes('Other' as any) && <option value="Other">Other</option>}
        </select>
        <button
          onClick={onAdd}
          className="md:col-span-1 inline-flex items-center justify-center gap-2 rounded-2xl font-semibold px-4 py-3 shadow"
          style={{ background: gold, color: '#111' }}
        >
          Add
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className="rounded-2xl px-3 py-1.5 border"
          style={{
            borderColor: filter === 'all' ? gold : '#2a2518',
            background: filter === 'all' ? gold : '#141414',
            color: filter === 'all' ? '#111' : parchment,
          }}
        >
          All
        </button>
        {DEFAULT_ORDER.map((c) => (
          <button
            key={c}
            onClick={() => onFilterChange(c)}
            className="rounded-2xl px-3 py-1.5 border"
            style={{
              borderColor: filter === c ? gold : '#2a2518',
              background: filter === c ? gold : '#141414',
              color: filter === c ? '#111' : parchment,
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );
}
