export type Category =
  | 'Gypsum'
  | 'Chest Runs & Locations'
  | 'Expeditions'
  | 'Seasonal Event'
  | 'Other';

export interface Quantity {
  count: number;
  max: number;
}

export interface Task {
  id: string;
  title: string;
  category: Category | string;
  done?: boolean;
  quantity?: Quantity; // optional per-day counter
}

export interface PersistShape {
  version: number;
  lastDay: string;
  tasksByDay: Record<string, Task[]>;
  categoryOrder: Category[];
}

export interface ChestRun {
  name: string;
  aliases?: string[];
  zone?: string;
  tags?: string[];
  slug?: string;
}
