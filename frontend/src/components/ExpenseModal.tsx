import React, { useEffect, useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import type { CategoryId, Expense, PaymentMethod } from '../types/expense';
import { CATEGORIES_META } from '../utils/categoryMeta';
import { WobblyButton } from './common/WobblyButton';
import { WobblyCard } from './common/WobblyCard';
import { WobblyInput, WobblySelect, WobblyTextArea } from './common/WobblyInput';
import { TapeStrip } from './common/ScribbleDecorations';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: Omit<Expense, 'id' | 'createdAt'>, editingId?: string) => void;
  onDelete?: (id: string) => void;
  initialData?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setPaymentMethod(initialData.paymentMethod);
      setDescription(initialData.description);
      setDate(initialData.date);
    } else {
      setAmount('');
      setCategory('food');
      setPaymentMethod('cash');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount!');
      return;
    }

    onSave(
      {
        amount: numAmount,
        category,
        paymentMethod,
        description: description.trim() || 'Manual Expense',
        date,
      },
      initialData?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="relative w-full max-w-md my-auto">
        <WobblyCard variant="white" wobblyStyle="wobbly-1" shadow="large" className="p-5 text-left">
          <TapeStrip className="-top-3 left-1/2 -translate-x-1/2" />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full border-2 border-[#2d2d2d] bg-[#fdfbf7] hover:bg-[#ff4d4d] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-4 text-center">
            <h2 className="text-2xl font-extrabold text-[#2d2d2d] font-heading">
              {initialData ? '✏️ Edit Expense' : '➕ Manual Add Expense'}
            </h2>
            <p className="text-sm text-[#2d2d2d]/70 font-body">
              Enter amount, category, cash/card, and details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <WobblyInput
                label="Amount ($) *"
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25.00"
              />

              <WobblySelect
                label="Category *"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                options={Object.values(CATEGORIES_META).map((c) => ({
                  value: c.id,
                  label: `${c.emoji} ${c.label}`,
                }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <WobblySelect
                label="Payment Method *"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                options={[
                  { value: 'cash', label: '💵 Cash Spent' },
                  { value: 'credit_card', label: '💳 Credit Card' },
                  { value: 'debit_card', label: '💳 Debit Card' },
                  { value: 'upi', label: '📱 UPI' },
                  { value: 'online', label: '🌐 Online' },
                ]}
              />

              <WobblyInput
                label="Date *"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <WobblyTextArea
              label="Detailed Description *"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What in detail was purchased? (e.g. Spent cash on petrol refill at Shell)"
            />

            <div className="flex items-center gap-2 pt-2">
              {initialData && onDelete && (
                <WobblyButton
                  type="button"
                  variant="danger"
                  size="md"
                  onClick={() => {
                    if (confirm('Delete this expense?')) {
                      onDelete(initialData.id);
                      onClose();
                    }
                  }}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Delete
                </WobblyButton>
              )}

              <WobblyButton type="button" variant="outline" size="md" fullWidth onClick={onClose}>
                Cancel
              </WobblyButton>

              <WobblyButton
                type="submit"
                variant="yellow"
                size="md"
                fullWidth
                icon={<Check className="w-4 h-4" />}
              >
                {initialData ? 'Save Changes' : 'Add Expense'}
              </WobblyButton>
            </div>
          </form>
        </WobblyCard>
      </div>
    </div>
  );
};
