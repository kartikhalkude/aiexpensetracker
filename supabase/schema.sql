-- =========================================================
-- Smart Expense Tracker AI - Normalized PostgreSQL Schema
-- Supabase Database Migration with Row Level Security (RLS)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS PROFILE TABLE (Synced with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    currency TEXT DEFAULT 'INR',
    monthly_budget_target NUMERIC(12, 2) DEFAULT 50000.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL for default system categories
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-seed 15 Core Categories
INSERT INTO public.categories (name, icon, color, is_default) VALUES
    ('Food', 'utensils', '#FF6B6B', TRUE),
    ('Shopping', 'shopping-bag', '#4D96FF', TRUE),
    ('Travel', 'car', '#6BCB77', TRUE),
    ('Fuel', 'gas-pump', '#FFD93D', TRUE),
    ('Entertainment', 'film', '#9966FF', TRUE),
    ('Medical', 'heart-pulse', '#FF6000', TRUE),
    ('Education', 'graduation-cap', '#36AE7C', TRUE),
    ('Salary', 'wallet', '#2EB086', TRUE),
    ('Investment', 'chart-line', '#1890FF', TRUE),
    ('Utilities', 'bolt', '#F86F03', TRUE),
    ('Bills', 'file-invoice-dollar', '#E15FED', TRUE),
    ('Rent', 'home', '#8D72E1', TRUE),
    ('Insurance', 'shield-halved', '#435585', TRUE),
    ('Subscription', 'repeat', '#00C49F', TRUE),
    ('Others', 'ellipsis-h', '#8E8E93', TRUE)
ON CONFLICT DO NOTHING;

-- 3. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    category TEXT NOT NULL,
    merchant TEXT NOT NULL,
    description TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'Card', 'Cash', 'Net Banking', 'Others')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    receipt_url TEXT,
    account_last4 VARCHAR(4),
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes for Transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_category ON public.transactions(user_id, category);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON public.transactions(user_id, type);

-- 4. BUDGETS TABLE
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    monthly_limit NUMERIC(12, 2) NOT NULL CHECK (monthly_limit > 0),
    spent_amount NUMERIC(12, 2) DEFAULT 0.00,
    period_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_category_period UNIQUE (user_id, category, period_month)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_period ON public.budgets(user_id, period_month);

-- 5. RECURRING TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    category TEXT NOT NULL,
    merchant TEXT NOT NULL,
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly', 'weekly')),
    next_due_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('budget_alert', 'recurring_reminder', 'weekly_summary', 'monthly_summary', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories Policies (View default categories or own custom categories)
CREATE POLICY "Users can view system or own categories" ON public.categories FOR SELECT USING (is_default = TRUE OR user_id = auth.uid());
CREATE POLICY "Users can insert custom categories" ON public.categories FOR INSERT WITH CHECK (user_id = auth.uid());

-- Transactions Policies
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (user_id = auth.uid());

-- Budgets Policies
CREATE POLICY "Users can view own budgets" ON public.budgets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own budgets" ON public.budgets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own budgets" ON public.budgets FOR UPDATE USING (user_id = auth.uid());

-- Recurring Transactions Policies
CREATE POLICY "Users can view own recurring transactions" ON public.recurring_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own recurring transactions" ON public.recurring_transactions FOR ALL USING (user_id = auth.uid());

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- =========================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
