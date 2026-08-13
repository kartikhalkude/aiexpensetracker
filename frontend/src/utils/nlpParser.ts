import type { CategoryId, ParsedExpense, PaymentMethod } from '../types/expense';

export function parseVoiceExpenseInput(text: string): ParsedExpense {
  const normalized = text.trim();
  const lower = normalized.toLowerCase();

  // 1. Extract Amount
  let amount: number | null = null;
  const match = lower.match(/(?:[\$\u20B9]|rs\.?|usd)?\s*(\d+(?:\.\d{1,2})?)\s*(?:dollars|bucks|rs|rupees|cents)?/i);
  if (match && match[1]) {
    const val = parseFloat(match[1]);
    if (!isNaN(val) && val > 0) amount = val;
  }

  // 2. Extract Category
  let category: CategoryId = 'other';

  if (/petrol|fuel|gas|diesel|gas station|shell|bp/i.test(lower)) {
    category = 'petrol';
  } else if (/grocery|groceries|supermarket|trader joe|walmart|target|vegetables|milk|fruits|mart/i.test(lower)) {
    category = 'grocery';
  } else if (/food|restaurant|coffee|starbucks|dinner|lunch|breakfast|pizza|burger|cafe|boba|doordash|ubereats|eats/i.test(lower)) {
    category = 'food';
  } else if (/bill|electricity|water|internet|wifi|phone|rent|utility/i.test(lower)) {
    category = 'bills';
  } else if (/shop|clothes|shoes|amazon|ebay|electronics|order/i.test(lower)) {
    category = 'shopping';
  } else if (/doctor|pharmacy|medicine|hospital|gym|health/i.test(lower)) {
    category = 'health';
  } else if (/salary|paycheck|income|freelance|bonus|stipend/i.test(lower)) {
    category = 'income';
  }

  // 3. Extract Payment Method
  let paymentMethod: PaymentMethod = 'cash';
  if (/card|credit|debit|visa|mastercard/i.test(lower)) {
    paymentMethod = 'credit_card';
  } else if (/upi|gpay|phonepe|paytm/i.test(lower)) {
    paymentMethod = 'upi';
  } else if (/online|paypal/i.test(lower)) {
    paymentMethod = 'online';
  } else if (/cash/i.test(lower)) {
    paymentMethod = 'cash';
  }

  return {
    rawText: normalized,
    amount,
    description: normalized || 'Voice Expense Entry',
    category,
    paymentMethod,
    date: new Date().toISOString().split('T')[0],
  };
}
