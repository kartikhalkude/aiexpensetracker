import type { Expense } from '../types/expense';

const EXPENSES_STORAGE_KEY = 'paper_spend_simple_v2';

export const INITIAL_SAMPLE_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    amount: 45.0,
    category: 'grocery',
    paymentMethod: 'cash',
    description: 'Fresh vegetables, milk, and fruits from supermarket',
    date: new Date().toISOString().split('T')[0],
    isVoiceLogged: true,
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'exp-2',
    amount: 28.5,
    category: 'petrol',
    paymentMethod: 'credit_card',
    description: 'Petrol tank refill at Shell gas station',
    date: new Date().toISOString().split('T')[0],
    isVoiceLogged: true,
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'exp-3',
    amount: 14.8,
    category: 'food',
    paymentMethod: 'cash',
    description: 'Lunch bowl & iced matcha at cafe',
    date: getFormattedPastDate(1),
    isVoiceLogged: false,
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'exp-4',
    amount: 95.0,
    category: 'bills',
    paymentMethod: 'online',
    description: 'Monthly electricity & power utility bill',
    date: getFormattedPastDate(3),
    isVoiceLogged: false,
    createdAt: Date.now() - 3600000 * 72,
  },
  {
    id: 'exp-5',
    amount: 3200.0,
    category: 'income',
    paymentMethod: 'online',
    description: 'Monthly salary paycheck credit',
    date: getFormattedPastDate(5),
    isVoiceLogged: false,
    createdAt: Date.now() - 3600000 * 120,
  },
];

function getFormattedPastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (!raw) {
      saveExpenses(INITIAL_SAMPLE_EXPENSES);
      return INITIAL_SAMPLE_EXPENSES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load expenses', err);
    return INITIAL_SAMPLE_EXPENSES;
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses', err);
  }
}

export function resetToSampleData(): Expense[] {
  saveExpenses(INITIAL_SAMPLE_EXPENSES);
  return INITIAL_SAMPLE_EXPENSES;
}
