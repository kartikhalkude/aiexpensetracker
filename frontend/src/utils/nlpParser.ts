import type { CategoryId, ParsedExpense, PaymentMethod } from '../types/expense';

export function parseVoiceExpenseInput(text: string): ParsedExpense {
  const normalized = text.trim();
  const lower = normalized.toLowerCase();

  // 1. Extract Amount
  // Handles: ₹500, Rs 200, 45.50, $30, "paanch sau", "tin hazar"
  let amount: number | null = null;

  const currencyMatch = lower.match(
    /(?:₹|rs\.?|rupe[e]?s?|inr)?\s*(\d+(?:[.,]\d{1,2})?)\s*(?:rupe[e]?s?|rs|inr|bucks?)?/i
  );
  if (currencyMatch && currencyMatch[1]) {
    const val = parseFloat(currencyMatch[1].replace(',', '.'));
    if (!isNaN(val) && val > 0) amount = val;
  }

  // Hindi/common number words fallback
  const hindiNumbers: Record<string, number> = {
    ek: 1, do: 2, teen: 3, char: 4, paanch: 5,
    chhe: 6, saat: 7, aath: 8, nau: 9, das: 10,
    bis: 20, tees: 30, chalis: 40, pachas: 50,
    saath: 60, sattar: 70, assi: 80, nabbe: 90,
    sau: 100, 'ek sau': 100, 'do sau': 200, 'teen sau': 300,
    'paanch sau': 500, hazar: 1000, 'ek hazar': 1000,
    'do hazar': 2000, 'teen hazar': 3000, 'paanch hazar': 5000,
  };
  if (amount === null) {
    for (const [word, num] of Object.entries(hindiNumbers)) {
      if (lower.includes(word)) { amount = num; break; }
    }
  }

  // 2. Category — supports English + Hindi/common Indian terms
  let category: CategoryId = 'other';

  if (/petrol|diesel|fuel|gas station|petrol pump|indane|bharat gas|hp gas|iocl/.test(lower)) {
    category = 'petrol';
  } else if (/grocery|groceries|sabzi|sabji|subzi|kirana|kiryana|ration|dal|chawal|atta|maida|supermarket|bazaar|market|vegetables?|veggies|fruits?/.test(lower)) {
    category = 'grocery';
  } else if (/food|restaurant|dhaba|hotel|khana|khane|lunch|dinner|breakfast|nashta|nasta|chai|tea|coffee|pizza|burger|biryani|thali|swiggy|zomato|cafe|fast food|snack/.test(lower)) {
    category = 'food';
  } else if (/bill|bijli|electricity|light bill|water bill|internet|wifi|broadband|gas bill|rent|mobile bill|phone bill|recharge|bijlee/.test(lower)) {
    category = 'bills';
  } else if (/shop|shopping|clothes|kapde|jute|shoes|amazon|flipkart|meesho|myntra|mall|market|purchase/.test(lower)) {
    category = 'shopping';
  } else if (/doctor|davai|dawa|medicine|pharmacy|chemist|hospital|clinic|gym|health|medical|tablet|injection/.test(lower)) {
    category = 'health';
  } else if (/salary|paycheck|income|freelance|bonus|stipend|payment received|paisa aaya|paise mile|mazdoori|fees received/.test(lower)) {
    category = 'income';
  }

  // 3. Payment Method — English + Hindi/UPI terms
  let paymentMethod: PaymentMethod = 'cash';

  if (/upi|gpay|google pay|phonepe|phone pe|paytm|bhim|neft|imps|rtgs/.test(lower)) {
    paymentMethod = 'upi';
  } else if (/credit card|credit/.test(lower)) {
    paymentMethod = 'credit_card';
  } else if (/debit card|debit|atm card/.test(lower)) {
    paymentMethod = 'debit_card';
  } else if (/online|net banking|netbanking/.test(lower)) {
    paymentMethod = 'online';
  } else if (/cash|nakit|nakad|naqd|naqdh/.test(lower)) {
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
