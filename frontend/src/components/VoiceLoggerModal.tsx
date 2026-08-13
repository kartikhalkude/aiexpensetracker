import React, { useEffect, useState } from 'react';
import { Check, Mic, MicOff, Volume2, X } from 'lucide-react';
import type { CategoryId, Expense, PaymentMethod } from '../types/expense';
import { parseVoiceExpenseInput } from '../utils/nlpParser';
import { CATEGORIES_META } from '../utils/categoryMeta';
import { WobblyButton } from './common/WobblyButton';
import { WobblyCard } from './common/WobblyCard';
import { WobblyInput, WobblySelect, WobblyTextArea } from './common/WobblyInput';
import { ThumbTack } from './common/ScribbleDecorations';

interface VoiceLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

const SAMPLE_PROMPTS = [
  'Spent $45 cash on groceries at supermarket',
  'Paid $28.50 for petrol refill',
  'Spent $15 cash on lunch food at cafe',
  'Paid $95 online for electricity bill',
];

export const VoiceLoggerModal: React.FC<VoiceLoggerModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  // Editable fields
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;

        recog.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);
          handleParseText(current);
        };

        recog.onend = () => setIsListening(false);
        recog.onerror = () => setIsListening(false);
        setRecognition(recog);
      }
    }
  }, []);

  const handleParseText = (text: string) => {
    if (!text.trim()) return;
    const parsed = parseVoiceExpenseInput(text);
    if (parsed.amount !== null) setAmount(parsed.amount.toString());
    setCategory(parsed.category);
    setPaymentMethod(parsed.paymentMethod);
    setDescription(parsed.description);
    setDate(parsed.date);
  };

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePromptClick = (text: string) => {
    setTranscript(text);
    handleParseText(text);
  };

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount!');
      return;
    }

    onAddExpense({
      amount: numAmount,
      category,
      paymentMethod,
      description: description.trim() || transcript || 'Voice Expense',
      date,
      isVoiceLogged: true,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="relative w-full max-w-md my-auto">
        <WobblyCard variant="postit" wobblyStyle="wobbly-1" shadow="large" className="p-5 text-left">
          <ThumbTack className="-top-3 left-1/2 -translate-x-1/2" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full border-2 border-[#2d2d2d] bg-white hover:bg-[#ff4d4d] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-extrabold text-[#2d2d2d] font-heading">
              🎤 Voice Add Expense
            </h2>
            <p className="text-sm font-body text-[#2d2d2d]/80">
              Speak or pick a sample prompt to auto-fill
            </p>
          </div>

          {/* Mic Record Button */}
          <div className="flex flex-col items-center justify-center my-3">
            <button
              onClick={toggleListening}
              className={`w-16 h-16 rounded-full border-3 border-[#2d2d2d] flex items-center justify-center text-white shadow-hand cursor-pointer ${
                isListening ? 'bg-[#ff4d4d]' : 'bg-[#2d5da1]'
              }`}
            >
              {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
            </button>
            <span className="text-sm font-heading font-bold mt-2 text-[#2d2d2d]">
              {isListening ? '🔴 Listening...' : 'Tap Mic to Speak'}
            </span>
          </div>

          {/* Transcribed Text */}
          {transcript && (
            <div className="bg-white border-2 border-[#2d2d2d] p-2.5 rounded-lg my-2 text-sm italic font-body">
              "{transcript}"
            </div>
          )}

          {/* Sample Prompts */}
          <div className="mb-3">
            <span className="text-xs font-heading font-bold text-[#2d2d2d]/70 flex items-center gap-1 mb-1">
              <Volume2 className="w-3.5 h-3.5" /> Sample voice prompts:
            </span>
            <div className="flex flex-wrap gap-1">
              {SAMPLE_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(p)}
                  className="text-xs font-body px-2 py-0.5 bg-white hover:bg-[#2d5da1] hover:text-white border border-[#2d2d2d] rounded cursor-pointer"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* Structured Fields */}
          <div className="space-y-3 bg-white p-3 border-2 border-[#2d2d2d] wobbly-1 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <WobblyInput
                label="Amount ($)"
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />

              <WobblySelect
                label="Category"
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
                label="Payment Method"
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
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <WobblyTextArea
              label="Description (What in detail)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Spent cash on organic milk, eggs & bread"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            <WobblyButton variant="outline" size="md" fullWidth onClick={onClose}>
              Cancel
            </WobblyButton>
            <WobblyButton
              variant="danger"
              size="md"
              fullWidth
              icon={<Check className="w-4 h-4" />}
              onClick={handleSave}
            >
              Save Expense
            </WobblyButton>
          </div>
        </WobblyCard>
      </div>
    </div>
  );
};
