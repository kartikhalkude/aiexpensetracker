import React, { useEffect, useState } from 'react';
import { Download, Mic, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import type { CategoryId, Expense } from './types/expense';
import { loadExpenses, resetToSampleData, saveExpenses } from './utils/storage';
import { CATEGORIES_META, getCategoryMeta } from './utils/categoryMeta';
import { exportExpensesToCSV } from './utils/export';
import { WobblyButton } from './components/common/WobblyButton';
import { WobblyCard } from './components/common/WobblyCard';
import { WobblyInput } from './components/common/WobblyInput';
import { StickyTag, TapeStrip, ThumbTack } from './components/common/ScribbleDecorations';
import { VoiceLoggerModal } from './components/VoiceLoggerModal';
import { ExpenseModal } from './components/ExpenseModal';

export const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    setExpenses(loadExpenses());
  }, []);

  const handleSaveExpenses = (updated: Expense[]) => {
    setExpenses(updated);
    saveExpenses(updated);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
    };
    handleSaveExpenses([newExpense, ...expenses]);
  };

  const handleSaveManual = (
    expenseData: Omit<Expense, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      const updated = expenses.map((e) =>
        e.id === editingId ? { ...e, ...expenseData } : e
      );
      handleSaveExpenses(updated);
    } else {
      handleAddExpense(expenseData);
    }
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    handleSaveExpenses(updated);
  };

  const handleReset = () => {
    if (confirm('Reset to sample expenses?')) {
      const sample = resetToSampleData();
      setExpenses(sample);
    }
  };

  // Filtered expenses
  const filtered = expenses.filter((exp) => {
    if (selectedCategory !== 'all' && exp.category !== selectedCategory) return false;
    if (search && !exp.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Total summary calculations
  const totalSpent = filtered
    .filter((e) => e.category !== 'income')
    .reduce((acc, e) => acc + e.amount, 0);

  const cashSpent = filtered
    .filter((e) => e.category !== 'income' && e.paymentMethod === 'cash')
    .reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2d2d2d] font-body p-4 max-w-xl mx-auto space-y-4 selection:bg-[#fff9c4]">
      {/* Simple Paper Header */}
      <WobblyCard variant="white" wobblyStyle="wobbly-1" shadow="standard" className="p-4 text-center">
        <TapeStrip className="-top-3 left-1/2 -translate-x-1/2" />
        <h1 className="text-3xl font-extrabold font-heading text-[#2d2d2d]">
          Paper<span className="text-[#ff4d4d]">Spend</span> ✏️
        </h1>
        <p className="text-sm font-body text-[#2d2d2d]/80">
          Exceptionally Simple Hand-Drawn Expense Tracker
        </p>

        {/* 2 Primary Add Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <WobblyButton
            variant="danger"
            size="lg"
            icon={<Mic className="w-5 h-5" />}
            onClick={() => setIsVoiceModalOpen(true)}
          >
            🎤 Voice Add
          </WobblyButton>

          <WobblyButton
            variant="yellow"
            size="lg"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => {
              setEditingExpense(null);
              setIsManualModalOpen(true);
            }}
          >
            ➕ Manual Add
          </WobblyButton>
        </div>
      </WobblyCard>

      {/* Summary Totals Banner */}
      <div className="grid grid-cols-2 gap-3">
        <WobblyCard variant="white" wobblyStyle="wobbly-2" shadow="small" className="p-3 text-left">
          <span className="font-heading text-xs font-bold text-[#2d2d2d]/70">Total Spent</span>
          <p className="text-2xl font-extrabold text-[#ff4d4d] font-heading mt-0.5">
            ${totalSpent.toFixed(2)}
          </p>
        </WobblyCard>

        <WobblyCard variant="postit" wobblyStyle="wobbly-1" shadow="small" className="p-3 text-left">
          <span className="font-heading text-xs font-bold text-[#2d2d2d]/70">Cash Spent 💵</span>
          <p className="text-2xl font-extrabold text-[#2d2d2d] font-heading mt-0.5">
            ${cashSpent.toFixed(2)}
          </p>
        </WobblyCard>
      </div>

      {/* Category Pills Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 text-sm font-heading font-bold rounded-lg border-2 border-[#2d2d2d] shrink-0 cursor-pointer ${
            selectedCategory === 'all' ? 'bg-[#ff4d4d] text-white' : 'bg-white text-[#2d2d2d]'
          }`}
        >
          All ({expenses.length})
        </button>
        {Object.values(CATEGORIES_META).map((cat) => {
          const count = expenses.filter((e) => e.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-sm font-heading font-bold rounded-lg border-2 border-[#2d2d2d] shrink-0 cursor-pointer ${
                selectedCategory === cat.id ? 'bg-[#2d5da1] text-white' : 'bg-white text-[#2d2d2d]'
              }`}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <WobblyInput
        icon={<Search className="w-4 h-4" />}
        placeholder="Search details (e.g. food, petrol, grocery)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Expense List */}
      <WobblyCard variant="white" wobblyStyle="wobbly-1" shadow="standard" className="p-4 text-left">
        <ThumbTack className="-top-3 left-6" />
        <div className="flex items-center justify-between border-b-2 border-dashed border-[#2d2d2d] pb-2 mb-3">
          <h2 className="text-xl font-bold font-heading text-[#2d2d2d]">
            📜 Stored Expenses ({filtered.length})
          </h2>
          <button
            onClick={() => exportExpensesToCSV(filtered)}
            className="text-xs font-heading font-bold text-[#2d5da1] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center py-6 font-body text-[#2d2d2d]/60">
            No expenses found. Click 🎤 Voice Add or ➕ Manual Add to add one!
          </p>
        ) : (
          <div className="space-y-3 divide-y-2 divide-dashed divide-[#2d2d2d]/20">
            {filtered.map((exp) => {
              const meta = getCategoryMeta(exp.category);
              return (
                <div key={exp.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-[#2d2d2d] flex items-center justify-center text-xl shrink-0 mt-0.5"
                      style={{ backgroundColor: meta.bgColor }}
                    >
                      {meta.emoji}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StickyTag text={meta.label} color={meta.tagColor} />
                        <span className="text-xs font-heading font-bold px-2 py-0.5 border border-[#2d2d2d] rounded bg-[#fdfbf7] capitalize">
                          {exp.paymentMethod === 'cash' ? '💵 Cash Spent' : exp.paymentMethod.replace('_', ' ')}
                        </span>
                        {exp.isVoiceLogged && (
                          <span className="text-[10px] font-heading bg-[#ff4d4d] text-white px-1.5 py-0.2 rounded border border-[#2d2d2d]">
                            🎤 VOICE
                          </span>
                        )}
                      </div>

                      {/* Detailed Description */}
                      <p className="text-base font-body font-bold text-[#2d2d2d] leading-snug">
                        {exp.description}
                      </p>

                      <span className="text-xs font-body text-[#2d2d2d]/60 block">
                        📅 {exp.date}
                      </span>
                    </div>
                  </div>

                  {/* Amount & Edit/Delete */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`font-heading font-extrabold text-xl ${
                        exp.category === 'income' ? 'text-[#2e7d32]' : 'text-[#2d2d2d]'
                      }`}
                    >
                      {exp.category === 'income' ? '+' : '-'}${exp.amount.toFixed(2)}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingExpense(exp);
                          setIsManualModalOpen(true);
                        }}
                        className="text-xs font-heading font-bold text-[#2d5da1] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-[#ff4d4d] hover:bg-[#ff4d4d]/10 p-1 rounded cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </WobblyCard>

      {/* Footer Reset Data Link */}
      <div className="text-center pt-2 pb-6">
        <button
          onClick={handleReset}
          className="text-xs font-heading font-bold text-[#2d2d2d]/60 hover:text-[#ff4d4d] inline-flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Reset Demo Data
        </button>
      </div>

      {/* Modals */}
      <VoiceLoggerModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAddExpense={handleAddExpense}
      />

      <ExpenseModal
        isOpen={isManualModalOpen}
        onClose={() => {
          setIsManualModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveManual}
        onDelete={handleDeleteExpense}
        initialData={editingExpense}
      />
    </div>
  );
};

export default App;
