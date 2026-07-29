import * as SQLite from 'expo-sqlite';
import { Transaction } from '@expense-tracker/shared';

let db: SQLite.SQLiteDatabase | null = null;

export const getLocalDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('expense_tracker_offline.db');

  // Initialize SQLite tables
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS local_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      merchant TEXT NOT NULL,
      description TEXT,
      payment_method TEXT NOT NULL,
      date TEXT NOT NULL,
      sync_status TEXT DEFAULT 'synced',
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  return db;
};

export const saveLocalTransaction = async (tx: Transaction, syncStatus: 'synced' | 'pending' = 'synced') => {
  const database = await getLocalDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO local_transactions (id, user_id, amount, type, category, merchant, description, payment_method, date, sync_status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [tx.id, tx.user_id, tx.amount, tx.type, tx.category, tx.merchant, tx.description || '', tx.payment_method, tx.date, syncStatus, tx.created_at || new Date().toISOString()]
  );
};

export const getLocalTransactions = async (): Promise<Transaction[]> => {
  const database = await getLocalDb();
  const rows = await database.getAllAsync<any>('SELECT * FROM local_transactions ORDER BY date DESC;');
  return rows.map(r => ({
    id: r.id,
    user_id: r.user_id,
    amount: r.amount,
    type: r.type,
    category: r.category,
    merchant: r.merchant,
    description: r.description,
    payment_method: r.payment_method,
    date: r.date,
    created_at: r.created_at
  }));
};
