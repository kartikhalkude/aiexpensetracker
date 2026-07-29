# 💎 Smart Expense Tracker AI
> **Production-Quality, AI-Powered Personal Finance & Expense Management App**

Built with **Expo (React Native)**, **Express.js (TypeScript)**, **Supabase (PostgreSQL & RLS)**, and **Python AI NLP Extraction Suite** (supporting Gemini & OpenAI).

---

## 🚀 Tech Stack

### **Mobile App (`/apps/mobile`)**
- **Framework**: Expo SDK 51, React Native, TypeScript, Expo Router
- **Styling**: NativeWind (Tailwind CSS v3) + Dynamic Dark/Light Glassmorphism Theme
- **State & Data Fetching**: Zustand, TanStack React Query
- **Charts**: Victory Native & React Native Chart Kit
- **Offline Storage & Sync**: Expo SQLite + Local Conflict Resolution Engine

### **Backend Server (`/apps/server`)**
- **Runtime**: Node.js (LTS), Express.js, TypeScript
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Security & Middleware**: Helmet, CORS, Morgan, Zod Payload Validation
- **Python NLP Bridge**: High-performance Inter-Process Communication (IPC) bridge with TS fallback

### **Python AI & NLP Extraction Suite (`/apps/server/src/nlp`)**
- **`extract_nlp.py`**: Auto-extracts structured transaction JSON from voice transcripts & text prompts.
- **`extract_sms.py`**: Indian Bank SMS auto-parser (HDFC, SBI, ICICI, Axis, Kotak, PNB, Paytm, PhonePe, Google Pay).
- **`assistant_qa.py`**: Financial assistant Q&A engine for budget evaluation & category insights.

---

## 📁 Repository Structure

```
aiexpensetracker/
├── apps/
│   ├── mobile/             # Expo React Native App
│   │   ├── src/app/        # Expo Router Pages & Tabs
│   │   ├── src/services/   # API & Offline SQLite Services
│   │   └── src/store/      # Zustand Client State
│   └── server/             # Express REST API Server
│       ├── src/controllers/# REST API Controllers
│       ├── src/nlp/        # Python AI NLP Extraction Scripts
│       └── src/services/   # Python IPC Bridge
├── packages/
│   └── shared/             # Shared TypeScript interfaces & Zod schemas
├── supabase/
│   └── schema.sql          # Database Schema & RLS Policies Migration
├── package.json            # Root monorepo workspace scripts
└── README.md
```

---

## ⚙️ Environment Variables Setup

### Backend Environment (`apps/server/.env`)
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key

PYTHON_EXECUTABLE=python
```

---

## 🛢️ Database Setup (Supabase)

1. Open your Supabase Dashboard -> SQL Editor.
2. Run the migration script in [`supabase/schema.sql`](file:///C:/Users/Kartik/.gemini/antigravity/scratch/supabase/schema.sql).
3. This creates:
   - Normalized PostgreSQL tables: `profiles`, `categories`, `transactions`, `budgets`, `recurring_transactions`, `notifications`.
   - 15 Pre-seeded default categories.
   - Row Level Security (RLS) policies for user data isolation.

---

## ⚡ Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Python NLP Extraction Engine
```bash
# Test Natural Language / Voice Prompt Parser
npm run test:nlp

# Test Indian Bank SMS Parser
npm run test:sms
```

### 3. Run Backend API Server
```bash
npm run dev:server
```

### 4. Run Mobile App (Expo)
```bash
npm run dev:mobile
```

---

## 📜 License
MIT © Kartik Halkude
