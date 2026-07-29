#!/usr/bin/env python3
"""
Smart Expense Tracker AI - Natural Language & Voice Input Parser
Extracts structured transaction details from natural language text or voice transcripts.
"""

import sys
import json
import os
import re
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

# Ensure UTF-8 output on Windows streams
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

CATEGORIES = [
    "Food", "Shopping", "Travel", "Fuel", "Entertainment", "Medical", 
    "Education", "Salary", "Investment", "Utilities", "Bills", 
    "Rent", "Insurance", "Subscription", "Others"
]

CATEGORY_KEYWORDS = {
    "Food": ["lunch", "dinner", "breakfast", "swiggy", "zomato", "restaurant", "food", "groceries", "supermarket", "snacks", "coffee", "starbucks", "dominos", "pizza"],
    "Shopping": ["amazon", "flipkart", "clothes", "shoes", "mall", "myntra", "shopping", "electronics", "store"],
    "Travel": ["uber", "ola", "flight", "train", "cab", "auto", "irctc", "bus", "travel", "ticket", "taxi"],
    "Fuel": ["petrol", "diesel", "fuel", "gas station", "shell", "hp", "iocl"],
    "Entertainment": ["movie", "cinema", "netflix", "prime", "spotify", "game", "concert", "park"],
    "Medical": ["doctor", "pharmacy", "medicine", "hospital", "clinic", "apollo", "chemist", "health"],
    "Education": ["tuition", "course", "udemy", "books", "school", "college", "fee", "exam"],
    "Salary": ["salary", "stipend", "paycheck", "wages", "income", "credit", "received"],
    "Investment": ["mutual fund", "stocks", "zerodha", "groww", "crypto", "sip", "deposit", "shares"],
    "Utilities": ["electricity", "water", "gas", "broadband", "wifi", "internet"],
    "Bills": ["bill", "mobile recharge", "postpaid", "dth"],
    "Rent": ["rent", "maintenance", "house rent", "pg"],
    "Insurance": ["insurance", "lic", "policy", "premium"],
    "Subscription": ["netflix", "spotify", "youtube", "amazon prime", "icloud", "chatgpt", "subscription"],
}

def regex_extract_nlp(text: str) -> Optional[Dict[str, Any]]:
    """Fast regex-based extractor for natural language transaction prompts."""
    text_lower = text.lower().strip()
    
    # Extract Amount
    # Matches: ₹500, Rs 500, Rs. 500, 500 rupees, spent 500, 500.50
    amount_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:rupees|rs|inr)?', text_lower)
    if not amount_match:
        return None
    
    raw_amount_str = amount_match.group(1).replace(',', '')
    try:
        amount = float(raw_amount_str)
    except ValueError:
        return None

    if amount <= 0:
        return None

    # Determine Type (income vs expense)
    tx_type = "expense"
    if any(k in text_lower for k in ["received", "got", "salary", "credited", "earned", "cashback", "refund"]):
        tx_type = "income"

    # Infer Category & Merchant
    category = "Others"
    merchant = "General"
    
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                category = cat
                merchant = kw.title()
                break
        if category != "Others":
            break

    # Infer Payment Method
    payment_method = "UPI"
    if "card" in text_lower or "credit" in text_lower or "debit" in text_lower:
        payment_method = "Card"
    elif "cash" in text_lower:
        payment_method = "Cash"
    elif "net banking" in text_lower or "transfer" in text_lower:
        payment_method = "Net Banking"

    # Infer Date (today vs yesterday)
    tx_date = datetime.now().strftime("%Y-%m-%d")
    if "yesterday" in text_lower:
        tx_date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    return {
        "amount": amount,
        "type": tx_type,
        "category": category,
        "merchant": merchant if merchant != "General" else category,
        "payment_method": payment_method,
        "date": tx_date,
        "description": text.strip(),
        "confidence": 0.88,
        "parsed_by": "regex_nlp_engine"
    }

def ai_extract_nlp(text: str) -> Dict[str, Any]:
    """Uses LLM (OpenAI or Gemini) or regex fallback to parse text."""
    api_key_openai = os.environ.get("OPENAI_API_KEY")
    api_key_gemini = os.environ.get("GEMINI_API_KEY")
    provider = os.environ.get("AI_PROVIDER", "gemini").lower()

    prompt = f"""
Extract transaction data from this natural language text/voice input: "{text}"
Return ONLY valid JSON matching this schema:
{{
  "amount": float,
  "type": "expense" | "income",
  "category": one of {json.dumps(CATEGORIES)},
  "merchant": string,
  "payment_method": "UPI" | "Card" | "Cash" | "Net Banking" | "Others",
  "date": "YYYY-MM-DD",
  "description": string,
  "confidence": float between 0 and 1
}}
"""

    if provider == "openai" and api_key_openai:
        try:
            import openai
            client = openai.OpenAI(api_key=api_key_openai)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            result = json.loads(response.choices[0].message.content)
            result["parsed_by"] = "openai_gpt4o"
            return result
        except Exception:
            pass

    if api_key_gemini:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key_gemini)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            clean_text = re.sub(r'```json\s*|\s*```', '', response.text).strip()
            result = json.loads(clean_text)
            result["parsed_by"] = "gemini_flash"
            return result
        except Exception:
            pass

    # Regex Fallback
    regex_res = regex_extract_nlp(text)
    if regex_res:
        return regex_res

    # Default Fallback
    return {
        "amount": 0.0,
        "type": "expense",
        "category": "Others",
        "merchant": "Unclassified",
        "payment_method": "UPI",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "description": text.strip(),
        "confidence": 0.50,
        "parsed_by": "fallback"
    }

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        test_inputs = [
            "I spent 500 rupees on groceries yesterday",
            "Spent 250 on lunch",
            "Received salary of 75000 from company",
            "Paid electricity bill of 1800 via UPI"
        ]
        print("=== Running NLP Extractor Test ===")
        for inp in test_inputs:
            res = ai_extract_nlp(inp)
            print(f"Input: '{inp}' => Output:\n{json.dumps(res, indent=2)}")
        return

    input_text = ""
    if len(sys.argv) > 1:
        input_text = " ".join(sys.argv[1:])
    else:
        input_text = sys.stdin.read().strip()

    if not input_text:
        print(json.dumps({"error": "No input text provided"}))
        sys.exit(1)

    result = ai_extract_nlp(input_text)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
