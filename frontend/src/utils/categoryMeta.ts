import type { CategoryId } from '../types/expense';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  emoji: string;
  bgColor: string;
  tagColor: string;
}

export const CATEGORIES_META: Record<CategoryId, CategoryInfo> = {
  food: {
    id: 'food',
    label: 'Food',
    emoji: '🍔',
    bgColor: '#ffe0b2',
    tagColor: '#ffcc80',
  },
  grocery: {
    id: 'grocery',
    label: 'Grocery',
    emoji: '🛒',
    bgColor: '#fff9c4',
    tagColor: '#fff59d',
  },
  petrol: {
    id: 'petrol',
    label: 'Petrol / Fuel',
    emoji: '⛽',
    bgColor: '#e3f2fd',
    tagColor: '#90caf9',
  },
  bills: {
    id: 'bills',
    label: 'Bills',
    emoji: '⚡',
    bgColor: '#f3e5f5',
    tagColor: '#ce93d8',
  },
  shopping: {
    id: 'shopping',
    label: 'Shopping',
    emoji: '🛍️',
    bgColor: '#e8f5e9',
    tagColor: '#a5d6a7',
  },
  health: {
    id: 'health',
    label: 'Health',
    emoji: '💊',
    bgColor: '#e0f2f1',
    tagColor: '#80cbc4',
  },
  income: {
    id: 'income',
    label: 'Income',
    emoji: '💰',
    bgColor: '#c8e6c9',
    tagColor: '#81c784',
  },
  other: {
    id: 'other',
    label: 'Misc / Other',
    emoji: '📌',
    bgColor: '#e5e0d8',
    tagColor: '#d6cfc4',
  },
};

export function getCategoryMeta(categoryId: CategoryId): CategoryInfo {
  return CATEGORIES_META[categoryId] || CATEGORIES_META.other;
}
