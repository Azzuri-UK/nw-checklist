import { PersistShape, Task, Category } from './types';
import { todayKey, TZ } from './dates';
import { DEFAULT_ORDER, DEFAULT_TASKS } from './presets';

const STORAGE_KEY = 'nw-checklist';

export function clearAllAndRebuild(nowKey: string = todayKey()): PersistShape {
    localStorage.removeItem(STORAGE_KEY);

    const fresh: PersistShape = {
        version: 1,
        lastDay: nowKey,
        tasksByDay: { [nowKey]: DEFAULT_TASKS.map((t) => ({ ...t, done: false })) },
        categoryOrder: [...DEFAULT_ORDER],
    };
    saveState(fresh);
    return fresh;
}

export function loadState(nowKey: string = todayKey()): PersistShape {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) throw new Error('no state');
        const parsed = JSON.parse(raw) as PersistShape;
        if (!parsed.version) throw new Error('legacy');

        if (!parsed.tasksByDay[nowKey]) {
            const prev = parsed.tasksByDay[parsed.lastDay] ?? [];
            parsed.tasksByDay[nowKey] = prev.map(({ id, title, category, quantity }) => ({
                id,
                title,
                category,
                done: false,
                quantity: quantity ? { ...quantity, count: 0 } : undefined,
            }));
            parsed.lastDay = nowKey;
            saveState(parsed);
        }
        return parsed;
    } catch {
        return clearAllAndRebuild(nowKey);
    }
}

export function saveState(state: PersistShape) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function setTasksForDay(
    state: PersistShape,
    dayKey: string,
    updater: (prev: Task[]) => Task[],
): PersistShape {
    const current = state.tasksByDay[dayKey] ?? [];
    const next: PersistShape = {
        ...state,
        lastDay: dayKey,
        tasksByDay: { ...state.tasksByDay, [dayKey]: updater(current) },
    };
    saveState(next);
    return next;
}

export function resetToDefaults(state: PersistShape, dayKey: string): PersistShape {
    return clearAllAndRebuild(dayKey);
}

export function resetCounters(state: PersistShape, dayKey: string): PersistShape {
    const current = state.tasksByDay[dayKey] ?? [];
    const nextList = current.map((t) =>
        t.quantity ? { ...t, quantity: { ...t.quantity, count: 0 }, done: false } : t,
    );
    const next: PersistShape = {
        ...state,
        lastDay: dayKey,
        tasksByDay: { ...state.tasksByDay, [dayKey]: nextList },
    };
    saveState(next);
    return next;
}

export function exportPayload(tasks: Task[], categories: Category[], day: string) {
    return { tasks, categories, exportedAt: new Date().toISOString(), tz: TZ, day };
}
