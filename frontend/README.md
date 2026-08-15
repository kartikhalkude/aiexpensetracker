# PaperSpend ✏️ — Voice & Manual Expense Tracker

A simple, fast, hand-drawn style expense tracker that works entirely in your browser. Log expenses by voice or manually. All data is stored locally — no account or backend required.

## Features

- 🎤 **Voice Add** — Speak an expense and the app auto-extracts amount, category, and payment method
- ➕ **Manual Add** — Fill in amount, category, cash/card, date, and detailed description
- 🛒 Categories: Food, Grocery, Petrol, Bills, Shopping, Health, Income, Other
- 💵 Cash Spent tracker + Total Spent summary
- 🔍 Search & filter by category
- 📥 Export to CSV
- 💾 All data stored in browser LocalStorage (no login needed)

## Tech Stack

- **React 19** + **TypeScript 6**
- **Vite 8** (bundler)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **lucide-react** (icons)
- **Web Speech API** (voice recognition — browser native)

## Local Development

```bash
cd frontend
npm install
npm run dev
```

## Production Build

```bash
cd frontend
npm run build
# Output is in frontend/dist/
```

## Deploy

The `frontend/dist/` folder is a fully static site. Deploy it to any static host:

- **Vercel**: Connect your GitHub repo, set root to `frontend`, build command `npm run build`, output dir `dist`
- **Netlify**: Same as above — root `frontend`, build command `npm run build`, publish dir `dist`
- **GitHub Pages**: Run `npm run build`, push the `dist/` contents to your `gh-pages` branch
