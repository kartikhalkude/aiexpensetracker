import { Transaction, Budget, NLPParseResult, SMSParseResult, AIAssistantResponse } from '@expense-tracker/shared';
import { getLocalTransactions, saveLocalTransaction } from './db';

const API_BASE = 'http://localhost:5000/api';

export class ApiService {
  private static token: string | null = null;

  public static setAuthToken(token: string | null) {
    this.token = token;
  }

  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    };
  }

  // Transactions
  public static async fetchTransactions(): Promise<Transaction[]> {
    try {
      const res = await fetch(`${API_BASE}/transactions`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        const txs: Transaction[] = data.transactions || [];
        for (const t of txs) {
          await saveLocalTransaction(t, 'synced');
        }
        return txs;
      }
    } catch (err) {
      console.warn('[ApiService] Offline mode active: loading transactions from SQLite');
    }
    return await getLocalTransactions();
  }

  public static async createTransaction(tx: Omit<Transaction, 'id' | 'user_id'>): Promise<Transaction> {
    const tempTx: Transaction = {
      id: `tx-local-${Date.now()}`,
      user_id: 'user-demo',
      ...tx
    };

    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(tx)
      });
      if (res.ok) {
        const data = await res.json();
        await saveLocalTransaction(data.transaction, 'synced');
        return data.transaction;
      }
    } catch (err) {
      console.warn('[ApiService] Backend unreachable: saved transaction to local SQLite queue');
      await saveLocalTransaction(tempTx, 'pending');
    }
    return tempTx;
  }

  // AI Voice / Natural Language Prompt Parser
  public static async parseNaturalLanguage(text: string): Promise<NLPParseResult> {
    const res = await fetch(`${API_BASE}/ai/parse-nlp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Failed to parse NLP input');
    const data = await res.json();
    return data.result;
  }

  // AI SMS Auto Parser
  public static async parseSMS(sms_text: string): Promise<SMSParseResult> {
    const res = await fetch(`${API_BASE}/ai/parse-sms`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ sms_text })
    });
    if (!res.ok) throw new Error('Failed to parse SMS');
    const data = await res.json();
    return data.result;
  }

  // Financial Assistant Q&A
  public static async queryAssistant(query: string): Promise<AIAssistantResponse> {
    const res = await fetch(`${API_BASE}/ai/assistant-query`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Failed to query assistant');
    const data = await res.json();
    return data.response;
  }

  // Budgets
  public static async fetchBudgets(): Promise<Budget[]> {
    try {
      const res = await fetch(`${API_BASE}/budgets`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.budgets || [];
      }
    } catch (err) {}
    return [
      { id: 'b1', user_id: 'demo', category: 'Food', monthly_limit: 10000, spent_amount: 250, period_month: '2026-07' },
      { id: 'b2', user_id: 'demo', category: 'Shopping', monthly_limit: 15000, spent_amount: 1499, period_month: '2026-07' }
    ];
  }
}
