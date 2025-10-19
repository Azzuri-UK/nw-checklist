'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {RotateCcw, Settings} from 'lucide-react';
import {Category, PersistShape, Task} from '@/lib/types';
import {CHEST_RUN_INDEX, CHEST_RUN_PRESET, CHEST_RUN_TAGS, DEFAULT_ORDER} from '@/lib/presets';
import {todayKey} from '@/lib/dates';
import {exportPayload, loadState, resetCounters, resetToDefaults, setTasksForDay} from '@/lib/storage';
import {progress, removeTask, setQuantity, toggleTask} from '@/lib/checklist';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import TaskItem from './TaskItem';
import QuantityControls from './QuantityControls';
import SettingsModal from './SettingsModal';
import RegionPicker from '@/components/RegionPicker';
import ResetCountdown from '@/components/ResetCountdown';
import { loadRegion } from '@/lib/regions';

export default function Checklist() {
    const [state, setState] = useState<PersistShape | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState<Category>('Gypsum');
    const [showSettings, setShowSettings] = useState(false);
    const [chestTag, setChestTag] = useState<string>('all');
    const [regionId, setRegionId] = React.useState(loadRegion().id);

    useEffect(() => {
        setState(loadState(todayKey()));
    }, []);

    const day = todayKey();
    const tasks = useMemo(() => state?.tasksByDay[day] ?? [], [state, day]);
    const categories = useMemo(() => state?.categoryOrder ?? DEFAULT_ORDER, [state]);

    const setTasks = (updater: (prev: Task[]) => Task[]) => {
        if (!state) return;
        const next = setTasksForDay(state, day, updater);
        setState(next);
    };

    const add = () => {
        if (!newTitle.trim()) return;
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setTasks((prev) => [{id, title: newTitle.trim(), category: newCategory, done: false}, ...prev]);
        setNewTitle('');
    };

    const resetDay = () => setTasks((prev) => prev.map((t) => ({...t, done: false})));

    const onImport = (json: string) => {
        try {
            const data = JSON.parse(json) as { tasks: Task[]; categories?: Category[] };
            if (!Array.isArray(data.tasks)) throw new Error('Invalid file');
            setState((s) => {
                const base = s ?? loadState(day);
                return setTasksForDay(base, day, () => data.tasks.map((t) => ({...t, done: !!t.done})));
            });
        } catch (e) {
            alert(`Import failed: ${e}`);
        }
    };

    const onExport = () => {
        const payload = exportPayload(tasks, categories, day);
        const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nw-checklist-${day}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const onRestoreDefaults = () => {
        if (!state) return;
        // reset localStorage to code defaults
        resetToDefaults(state, day);
        // hard reload to ensure any changed titles/aliases from presets are visible right away
        window.location.reload();
    };

    const onResetCounters = () => {
        if (!state) return;
        const next = resetCounters(state, day);
        setState(next);
    };

    if (!state) return <div className="p-6 text-[#f1e9d2]">Loading checklist...</div>;

    const stats = progress(tasks);
    const gold = '#c8a74e';
    const parchment = '#f1e9d2';

    const isChestRunTask = (t: Task) => t.category === 'Chest Runs & Locations' && /^c-/.test(t.id);
    const chestRunMatchesTag = (t: Task) => {
        if (chestTag === 'all') return true;
        const slug = t.id.replace(/^c-/, '');
        const meta = CHEST_RUN_INDEX[slug];
        if (!meta) return false;
        return (meta.tags ?? []).includes(chestTag);
    };

    const chestAddByTag = () => setTasks((prev) => [
        ...CHEST_RUN_PRESET
            .filter((p) => chestTag === 'all' ? true : (CHEST_RUN_INDEX[p.slug]?.tags ?? []).includes(chestTag))
            .map((p) => ({id: `c-${p.slug}`, title: p.title, category: p.category, done: false})),
        ...prev,
    ]);

    const renderChestSubtitle = (t: Task) => {
        if (!isChestRunTask(t)) return null;
        const slug = t.id.replace(/^c-/, '');
        const meta = CHEST_RUN_INDEX[slug];
        if (!meta) return null;
        return (
            <div className="flex flex-wrap items-center gap-1.5">
                {meta.aliases?.length ? <span className="opacity-75">Aliases: {meta.aliases.join(' / ')}</span> : null}
                {meta.zone ? <span className="opacity-60">• {meta.zone}</span> : null}
                {(meta.tags ?? []).map((tag) => (
                    <span key={tag} className="rounded-full px-2 py-0.5 text-[10px] border" style={{borderColor: gold, color: gold}}>{tag}</span>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen" style={{backgroundImage: 'radial-gradient(60% 80% at 50% 0%, #151515 0%, #0b0b0b 60%, #020202 100%)', color: parchment}}>
            <div className="mx-auto max-w-4xl px-4 py-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ textShadow: '0 1px 0 #000' }}>
                            New World {'\u2022'} Daily Checklist
                        </h1>
                        <p className="mt-1 text-sm opacity-80">
                            {day} {'\u2022'} Europe/London
                        </p>

                        {/* NEW: region and countdown */}
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <RegionPicker value={regionId} onChange={setRegionId} />
                            <ResetCountdown regionId={regionId as any} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowSettings((s) => !s)}
                                className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 transition shadow-sm"
                                style={{borderColor: '#2a2518', background: '#13110c'}}>
                            <Settings className="h-4 w-4"/> <span className="hidden sm:inline">Settings</span>
                        </button>
                        <button onClick={resetDay} className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 transition shadow-sm"
                                style={{borderColor: '#2a2518', background: '#13110c'}} title="Reset today (uncheck all)">
                            <RotateCcw className="h-4 w-4"/> <span className="hidden sm:inline">Reset</span>
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <ProgressBar pct={stats.pct}/>
                    <div className="mt-2 text-sm opacity-80">{stats.done}/{stats.total} done {'\u2022'} {stats.pct}%</div>
                </div>

                <Controls categories={categories} newTitle={newTitle} newCategory={newCategory} onTitleChange={setNewTitle}
                          onCategoryChange={(c) => setNewCategory(c as Category)} onAdd={add} filter={filter} onFilterChange={setFilter}/>

                <div className="mt-6 space-y-6">
                    {categories.map((cat) => {
                        // Apply the category filter ("All" vs a specific category)
                        let list = tasks.filter(
                            (t) => t.category === cat && (filter === 'all' || filter === cat)
                        );

                        // Apply chest-run tag filter if needed
                        if (cat === 'Chest Runs & Locations') {
                            list = list.filter((t) => !isChestRunTask(t) || chestRunMatchesTag(t));
                        }

                        return (
                            <section key={cat}>
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-semibold" style={{color: gold}}>
                                        {cat}
                                    </h2>

                                    {cat === 'Chest Runs & Locations' && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <label className="opacity-80">Tag:</label>
                                            <select
                                                value={chestTag}
                                                onChange={(e) => setChestTag(e.target.value)}
                                                className="rounded-xl border px-2 py-1"
                                                style={{
                                                    background: '#141414',
                                                    borderColor: '#2a2518',
                                                    color: '#f1e9d2',
                                                }}
                                            >
                                                <option value="all">All</option>
                                                {CHEST_RUN_TAGS.map((t) => (
                                                    <option key={t} value={t}>
                                                        {t}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {list.length === 0 ? (
                                    cat === 'Chest Runs & Locations' ? (
                                        <div
                                            className="rounded-xl border p-4 text-sm opacity-90"
                                            style={{background: '#0e0d09', borderColor: '#2a2518'}}
                                        >
                                            No tasks for tag “{chestTag}” in this category.
                                            {' '}
                                            <button
                                                onClick={chestAddByTag}
                                                className="underline"
                                                style={{color: gold}}
                                                title="Add all chest runs matching current tag"
                                            >
                                                Quick add them
                                            </button>
                                            .
                                        </div>
                                    ) : (
                                        <div
                                            className="rounded-xl border p-4 text-sm opacity-80"
                                            style={{background: '#0e0d09', borderColor: '#2a2518'}}
                                        >
                                            No tasks in this category.
                                        </div>
                                    )
                                ) : (
                                    <ul className="space-y-2">
                                        {list.map((t) => {
                                            const isQuantified = !!t.quantity;

                                            const right = isQuantified ? (
                                                <QuantityControls
                                                    count={t.quantity!.count}
                                                    max={t.quantity!.max}
                                                    onDec={() =>
                                                        setTasks((prev) =>
                                                            setQuantity(prev, t.id, (c) => ({count: c - 1}))
                                                        )
                                                    }
                                                    onInc={() =>
                                                        setTasks((prev) =>
                                                            setQuantity(prev, t.id, (c) => ({count: c + 1}))
                                                        )
                                                    }
                                                    onSetMax={(v) =>
                                                        setTasks((prev) =>
                                                            setQuantity(prev, t.id, (c) => ({
                                                                count: Math.min(c, v),
                                                                max: v,
                                                            }))
                                                        )
                                                    }
                                                />
                                            ) : undefined;

                                            const subtitle = isQuantified ? (
                                                <div className="mt-1">
                                                    <div
                                                        className="h-1 w-full rounded overflow-hidden"
                                                        style={{background: '#1a1a1a'}}
                                                    >
                                                        <div
                                                            className="h-full"
                                                            style={{
                                                                width: `${Math.min(
                                                                    100,
                                                                    Math.round(
                                                                        (t.quantity!.count / t.quantity!.max) * 100
                                                                    )
                                                                )}%`,
                                                                background: gold,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                renderChestSubtitle(t)
                                            );

                                            return (
                                                <TaskItem
                                                    key={t.id}
                                                    task={t}
                                                    onToggle={() => setTasks((prev) => toggleTask(prev, t.id))}
                                                    onRemove={() => setTasks((prev) => removeTask(prev, t.id))}
                                                    subtitle={subtitle}
                                                    extraRight={right}
                                                />
                                            );
                                        })}
                                    </ul>
                                )}
                            </section>
                        );
                    })}
                </div>


                {showSettings && (
                    <SettingsModal
                        open={showSettings}
                        onClose={() => setShowSettings(false)}
                        onExport={onExport}
                        onImport={onImport}
                        onQuickAddChestByTag={chestAddByTag}
                        onResetCounters={onResetCounters}
                        onRestoreDefaults={() => {
                            onRestoreDefaults();      // your existing handler that clears localStorage…
                            // ensure a hard reload so latest presets show immediately
                            window.location.reload();
                        }}
                    />
                )}

                <div className="mt-10 text-xs opacity-70">Built for Next.js App Router.</div>
            </div>
        </div>
    );
}
