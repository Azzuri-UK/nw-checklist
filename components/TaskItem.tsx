'use client';
import React from 'react';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import type { Task } from '@/lib/types';

export default function TaskItem({
  task,
  onToggle,
  onRemove,
  subtitle,
  extraRight,
}: {
  task: Task;
  onToggle: () => void;
  onRemove: () => void;
  subtitle?: React.ReactNode;
  extraRight?: React.ReactNode;
}) {
  const gold = '#c8a74e';
  return (
    <li className="group rounded-2xl px-3 py-2" style={{ background: '#13110c', border: '1px solid #2a2518' }}>
      <div className="flex items-start gap-3">
        <button onClick={onToggle} className="mt-0.5" title={task.done ? 'Mark as not done' : 'Mark as done'}>
          {task.done ? <CheckCircle2 className="h-5 w-5" style={{ color: gold }} /> : <Circle className="h-5 w-5" style={{ color: '#9d8a60' }} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className={`truncate ${task.done ? 'line-through opacity-70' : ''}`}>{task.title}</div>
          {subtitle && <div className="mt-1 text-xs opacity-90">{subtitle}</div>}
        </div>
        {extraRight}
        <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition" title="Remove task">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
