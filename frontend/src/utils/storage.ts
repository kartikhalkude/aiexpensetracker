import type { Expense } from '../types/expense';

const EXPENSES_STORAGE_KEY = 'paper_spend_simple_v3';

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load expenses', err);
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses', err);
  }
}

export function clearAllExpenses(): void {
  localStorage.removeItem(EXPENSES_STORAGE_KEY);
}
