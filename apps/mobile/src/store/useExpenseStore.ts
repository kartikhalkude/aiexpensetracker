import { create } from 'zustand';
import { Transaction, Budget, UserProfile } from '@expense-tracker/shared';
import { ApiService } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendation?: string;
}

interface ExpenseStore {
  darkMode: boolean;
  user: UserProfile | null;
  transactions: Transaction[];
  budgets: Budget[];
  chatMessages: ChatMessage[];
  isLoading: boolean;
  
  toggleDarkMode: () => void;
  setUser: (user: UserProfile | null) => void;
  loadTransactions: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'user_id'>) => Promise<Transaction>;
  loadBudgets: () => Promise<void>;
  sendChatMessage: (text: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  darkMode: true,
  user: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'user@expensetracker.ai',
    full_name: 'Kartik Halkude',
    currency: 'INR',
    monthly_budget_target: 50000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  transactions: [],
  budgets: [],
  chatMessages: [
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your AI Financial Assistant. Ask me anything about your spending, budget limits, or category analysis.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  isLoading: false,

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setUser: (user) => set({ user }),

  loadTransactions: async () => {
    set({ isLoading: true });
    try {
      const txs = await ApiService.fetchTransactions();
      set({ transactions: txs, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  addTransaction: async (txData) => {
    const newTx = await ApiService.createTransaction(txData);
    set((state) => ({ transactions: [newTx, ...state.transactions] }));
    return newTx;
  },

  loadBudgets: async () => {
    try {
      const budgets = await ApiService.fetchBudgets();
      set({ budgets });
    } catch (err) {}
  },

  sendChatMessage: async (text) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    set((state) => ({ chatMessages: [...state.chatMessages, userMsg] }));

    try {
      const aiRes = await ApiService.queryAssistant(text);
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiRes.answer,
        recommendation: aiRes.recommendation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      set((state) => ({ chatMessages: [...state.chatMessages, aiMsg] }));
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I had trouble processing your query. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      set((state) => ({ chatMessages: [...state.chatMessages, errorMsg] }));
    }
  }
}));
