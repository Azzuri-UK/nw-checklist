import type {Category, ChestRun, Task} from './types';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const RAW: ChestRun[] = [
    {name: 'Imperial Palace', aliases: ['IMP'], zone: 'Ebonscale', tags: ['Infix Farming']},
    {name: "Attalus's Foundry", aliases: ['ATTA'], zone: 'Ebonscale', tags: ['Infix Farming']},
    {name: 'Scorched Mines', aliases: ['MINES'], zone: 'Shattered Mountain', tags: ['Infix Farming']},
    {name: 'Myrkgard', aliases: ['MYRK'], zone: 'Shattered Mountain', tags: ['Infix Farming']},
    {name: 'Malevolence', aliases: ['MALV'], zone: 'Edengrove'},
    {name: 'Eternal Pool', aliases: ['POOL'], zone: 'Reekwater', tags: ['Infix Farming']},
    {name: 'Forecastle Drift', aliases: ['SIREN'], zone: 'Reekwater', tags: []},
    {name: 'Cayo De La Muerte', aliases: ['CK'], zone: 'Cutlass Keys', tags: []},
    {name: 'Heliopolis', aliases: ['HELIOS'], zone: 'Brimstone Sands', tags: []},
    {name: 'Great Wall of Nebet-Het', aliases: ['WALL', 'WEST WALL'], zone: 'Brimstone Sands', tags: []},
    {name: 'Beds of Ta-Bitjet', aliases: ['BEDS'], zone: 'Brimstone Sands', tags: []},
    {name: 'Castrum Principium', aliases: ['CAST'], zone: 'Brimstone Sands', tags: []},
    {name: 'Solarium Khepri', aliases: ['KHEPRI', 'KHEP'], zone: 'Brimstone Sands', tags: []},
    {name: 'Isle of Zurvan', aliases: ['ZURVAN', 'ZURV'], zone: 'Elysian Wilds', tags: ['Group 5+']},
    {name: 'Tribunal Highmound', aliases: ['TRIB'], zone: 'Elysian Wilds', tags: ['Infix Farming']},
    {name: 'Scorpios', aliases: ['SCORPIOS'], zone: 'Mourningdale', tags: ['Infix Farming']},
    {name: 'Sulfur Pools', aliases: [], zone: 'Brimstone Sands', tags: ['Solo']},
];

export const CHEST_RUNS: ChestRun[] = RAW.map(r => ({...r, slug: r.slug ?? slugify(r.name)}));
export const CHEST_RUN_INDEX: Record<string, ChestRun> = Object.fromEntries(CHEST_RUNS.map(r => [r.slug!, r]));
export const CHEST_RUN_TAGS: string[] = Array.from(new Set(CHEST_RUNS.flatMap(r => r.tags ?? []))).sort();

const aliasLabel = (a?: string[]) => a && a.length ? ` (${a.join(' / ')})` : '';

export const DEFAULT_ORDER: Category[] = ['Chest Runs & Locations', 'Gypsum', 'Expeditions', 'Seasonal Event', 'Other'];

export const DEFAULT_TASKS: Task[] = [
    {id: 'g-obsidian', title: 'Obsidian Gypsum (Arenas / Trials)', category: 'Gypsum'},
    {id: 'g-topaz', title: 'Topaz Gypsum (Attunement Potion)', category: 'Gypsum'},
    {id: 'g-sapphire', title: 'Sapphire Gypsum (Expeditions)', category: 'Gypsum'},
    {id: 'g-emerald', title: 'Emerald Gypsum (Trade Skill Aptitude)', category: 'Gypsum'},

    ...CHEST_RUNS.map(r => ({
        id: `c-${r.slug}`,
        title: `${r.name}${aliasLabel(r.aliases)}`,
        category: 'Chest Runs & Locations' as Category
    })),

    // Expedition counters (defaults can be edited in UI)
    {id: 'e-bonus', title: 'Random Expedition (non-mutated)', category: 'Expeditions', quantity: {count: 0, max: 3}},
    {id: 'e-mut-rotation', title: 'Random Mutated Expedition', category: 'Expeditions', quantity: {count: 0, max: 2}},

    {id: 's-event', title: 'Seasonal Event Daily (e.g., Nightveil Hallow, Medleyfaire)', category: 'Seasonal Event'},
];

export const CHEST_RUN_PRESET: { title: string; category: Category; slug: string }[] =
    CHEST_RUNS.map(r => ({title: `${r.name}${aliasLabel(r.aliases)}`, category: 'Chest Runs & Locations' as Category, slug: r.slug!}));
