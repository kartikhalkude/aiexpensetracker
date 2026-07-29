#!/usr/bin/env python3
"""
Smart Expense Tracker AI - Financial Assistant Q&A Engine
Answers user financial queries, evaluates budget capabilities, and provides spending insights.
"""

import sys
import json
import os
import re
from typing import Dict, Any, List

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def answer_financial_query(query: str, context: Dict[str, Any]) -> Dict[str, Any]:
    """Answers financial questions using contextual transaction & budget data."""
    q_lower = query.lower().strip()
    transactions: List[Dict[str, Any]] = context.get("transactions", [])
    budgets: List[Dict[str, Any]] = context.get("budgets", [])

    # Calculate category totals
    category_totals: Dict[str, float] = {}
    total_expense = 0.0
    total_income = 0.0

    for tx in transactions:
        amt = float(tx.get("amount", 0))
        cat = tx.get("category", "Others")
        t_type = tx.get("type", "expense")

        if t_type == "expense":
            total_expense += amt
            category_totals[cat] = category_totals.get(cat, 0.0) + amt
        elif t_type == "income":
            total_income += amt

    # 1. Category specific query (e.g., "How much did I spend on food?")
    for cat in ["food", "shopping", "travel", "fuel", "entertainment", "medical", "rent", "utilities", "bills"]:
        if cat in q_lower:
            cat_name = cat.title()
            cat_spent = category_totals.get(cat_name, 0.0)
            return {
                "answer": f"You have spent ₹{cat_spent:,.2f} on {cat_name} based on your recent transactions.",
                "category": cat_name,
                "amount": cat_spent,
                "recommendation": f"Keep an eye on your {cat_name} budget to ensure you stay within monthly limits.",
                "parsed_by": "assistant_category_engine"
            }

    # 2. Spend capability check (e.g., "Can I spend another ₹5,000?")
    amount_match = re.search(r'(?:can i spend|spend another|budget for)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)', q_lower)
    if amount_match:
        requested_amt = float(amount_match.group(1).replace(',', ''))
        balance = total_income - total_expense
        if balance >= requested_amt:
            return {
                "answer": f"Yes, you can comfortably spend ₹{requested_amt:,.2f}. Your current available balance is ₹{balance:,.2f}.",
                "recommendation": "Ensure this planned expense fits into your active monthly category budgets.",
                "parsed_by": "assistant_budget_evaluator"
            }
        else:
            return {
                "answer": f"Warning: Spending ₹{requested_amt:,.2f} exceeds your remaining net balance of ₹{balance:,.2f}.",
                "recommendation": "Consider postponing non-essential purchases or reallocating budget from other categories.",
                "parsed_by": "assistant_budget_evaluator"
            }

    # 3. Highest spending category query
    if "increase" in q_lower or "highest" in q_lower or "most" in q_lower:
        if category_totals:
            top_cat = max(category_totals.items(), key=lambda x: x[1])
            return {
                "answer": f"Your highest spending category is {top_cat[0]} with a total of ₹{top_cat[1]:,.2f}.",
                "recommendation": f"Review transactions in {top_cat[0]} to find opportunities for potential savings.",
                "parsed_by": "assistant_trend_engine"
            }

    # 4. LLM AI fallback
    api_key_openai = os.environ.get("OPENAI_API_KEY")
    api_key_gemini = os.environ.get("GEMINI_API_KEY")

    if api_key_openai or api_key_gemini:
        # LLM integration can format custom responses
        pass

    # Generic Smart Fallback Answer
    balance = total_income - total_expense
    return {
        "answer": f"Your net balance is ₹{balance:,.2f} (Total Income: ₹{total_income:,.2f}, Total Expense: ₹{total_expense:,.2f}).",
        "recommendation": "You can ask questions like 'How much did I spend on food?' or 'Can I spend another ₹5,000?'.",
        "parsed_by": "assistant_general_summary"
    }

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        sample_context = {
            "transactions": [
                {"amount": 250, "category": "Food", "type": "expense"},
                {"amount": 1499, "category": "Shopping", "type": "expense"},
                {"amount": 450, "category": "Fuel", "type": "expense"},
                {"amount": 50000, "category": "Salary", "type": "income"}
            ],
            "budgets": [
                {"category": "Food", "limit": 10000}
            ]
        }
        queries = [
            "How much did I spend on food?",
            "Can I spend another 5000?",
            "Which category did I spend the most on?"
        ]
        print("=== Running Assistant Q&A Test ===")
        for q in queries:
            res = answer_financial_query(q, sample_context)
            print(f"Q: '{q}' => A:\n{json.dumps(res, indent=2)}")
        return

    payload = {}
    try:
        raw_in = sys.stdin.read().strip()
        if raw_in:
            payload = json.loads(raw_in)
    except Exception:
        pass

    query = payload.get("query", "Summary of expenses")
    context = payload.get("context", {})

    res = answer_financial_query(query, context)
    print(json.dumps(res))

if __name__ == "__main__":
    main()
