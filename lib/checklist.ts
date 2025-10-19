import type { Task } from './types';

export function progress(tasks: Task[]) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id);
}

export function setQuantity(
  tasks: Task[],
  id: string,
  updater: (count: number, max: number) => { count: number; max?: number }
): Task[] {
  return tasks.map((t) => {
    if (t.id !== id || !t.quantity) return t;
    const next = updater(t.quantity.count, t.quantity.max);
    const max = typeof next.max === 'number' ? next.max : t.quantity.max;
    const count = Math.max(0, Math.min(next.count, max));
    return { ...t, quantity: { count, max }, done: count >= max };
  });
}
