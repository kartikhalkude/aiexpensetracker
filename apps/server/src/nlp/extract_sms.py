#!/usr/bin/env python3
"""
Smart Expense Tracker AI - Indian Bank SMS Parser
Extracts structured transaction details from SMS strings for major Indian banks.
Supports HDFC, SBI, ICICI, Axis, Kotak, PNB, Bank of Baroda, Paytm, PhonePe, Google Pay.
"""

import sys
import json
import os
import re
from datetime import datetime
from typing import Dict, Any, Optional

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

CATEGORIES = [
    "Food", "Shopping", "Travel", "Fuel", "Entertainment", "Medical", 
    "Education", "Salary", "Investment", "Utilities", "Bills", 
    "Rent", "Insurance", "Subscription", "Others"
]

MERCHANT_CATEGORY_MAP = {
    "swiggy": "Food", "zomato": "Food", "dominos": "Food", "mcdonalds": "Food", "starbucks": "Food", "kfc": "Food",
    "amazon": "Shopping", "flipkart": "Shopping", "myntra": "Shopping", "nykaa": "Shopping", "zudio": "Shopping",
    "uber": "Travel", "ola": "Travel", "irctc": "Travel", "redbus": "Travel", "makemytrip": "Travel",
    "shell": "Fuel", "hpcl": "Fuel", "bpcl": "Fuel", "iocl": "Fuel", "petrol": "Fuel",
    "netflix": "Subscription", "spotify": "Subscription", "prime": "Subscription", "hotstar": "Subscription",
    "apollo": "Medical", "pharmeasy": "Medical", "1mg": "Medical",
    "salary": "Salary", "bescom": "Utilities", "airtel": "Bills", "jio": "Bills", "zerodha": "Investment"
}

def parse_sms_regex(sms_text: str) -> Optional[Dict[str, Any]]:
    """Parse SMS using robust regex matching for Indian banks."""
    clean_text = sms_text.replace('\n', ' ').strip()
    text_lower = clean_text.lower()

    # Determine bank
    bank = "BANK"
    for b in ["hdfc", "sbi", "icici", "axis", "kotak", "pnb", "bob", "paytm", "phonepe", "gpay"]:
        if b in text_lower:
            bank = b.upper()
            break

    # Determine last 4 digits of A/C or Card
    acc_match = re.search(r'(?:a/c|account|card)\s*(?:no\.?|xx|\*)*\s*(\d{3,4})', text_lower)
    account_last4 = acc_match.group(1) if acc_match else "XXXX"

    # Transaction Type
    tx_type = "expense"
    if "credited" in text_lower or "received" in text_lower or "salary" in text_lower:
        tx_type = "income"

    # Extract Amount
    # Matches: Rs 1,499.00, Rs. 250, ₹50,000.00, Rs 500
    amt_match = re.search(r'(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)', text_lower)
    if not amt_match:
        # Alternative order: 50,000.00 credited
        amt_match = re.search(r'([\d,]+(?:\.\d{1,2})?)\s*(?:credited|debited)', text_lower)

    if not amt_match:
        return None

    try:
        amount = float(amt_match.group(1).replace(',', ''))
    except ValueError:
        return None

    if amount <= 0:
        return None

    # Extract Merchant Name
    merchant = "Merchant"
    merch_patterns = [
        r'(?:at|to|from|by)\s+([a-zA-Z0-9\s\.\&\-]+?)(?:\s+on|\.\s+ref|\s+via|\s+using|\.|\,|$)',
        r'debited\s+.*?\s+to\s+([a-zA-Z0-9\s\.\&\-]+?)(?:\.|\,|$)',
        r'credited\s+.*?\s+by\s+([a-zA-Z0-9\s\.\&\-]+?)(?:\.|\,|$)'
    ]

    for pat in merch_patterns:
        m = re.search(pat, text_lower)
        if m:
            raw_m = m.group(1).strip()
            # filter out dates, ref numbers, card words
            raw_m = re.sub(r'^\d{1,2}[\/\-\.][a-zA-Z0-9\/\-\.]+\s*', '', raw_m)
            if raw_m and len(raw_m) > 1 and raw_m not in ["card", "upi", "a/c", "ref"]:
                merchant = raw_m.title()
                break

    # Clean merchant title
    merchant = re.sub(r'\s*(ref|vpa|val|date|txn).*$', '', merchant, flags=re.IGNORECASE).strip()
    if not merchant or len(merchant) < 2:
        merchant = f"{bank} {tx_type.title()}"

    # Infer Category
    category = "Others"
    if tx_type == "income" and ("salary" in text_lower or "company" in text_lower):
        category = "Salary"
    else:
        for k, cat in MERCHANT_CATEGORY_MAP.items():
            if k in merchant.lower() or k in text_lower:
                category = cat
                break

    # Payment Method
    payment_method = "UPI" if "upi" in text_lower or "vpa" in text_lower else ("Card" if "card" in text_lower else "Bank A/C")

    # Date
    tx_date = datetime.now().strftime("%Y-%m-%d")

    return {
        "amount": amount,
        "type": tx_type,
        "category": category,
        "merchant": merchant,
        "account_last4": account_last4,
        "payment_method": payment_method,
        "date": tx_date,
        "raw_sms": sms_text,
        "confidence": 0.90,
        "parsed_by": f"sms_regex_{bank.lower()}"
    }

def parse_sms_ai(sms_text: str) -> Dict[str, Any]:
    """Parse SMS with regex parser first; fallback to AI."""
    regex_res = parse_sms_regex(sms_text)
    if regex_res:
        return regex_res

    api_key_openai = os.environ.get("OPENAI_API_KEY")
    api_key_gemini = os.environ.get("GEMINI_API_KEY")

    prompt = f"""
Parse this bank transaction SMS: "{sms_text}"
Return ONLY valid JSON matching this schema:
{{
  "amount": float,
  "type": "expense" | "income",
  "category": one of {json.dumps(CATEGORIES)},
  "merchant": string,
  "account_last4": string,
  "payment_method": "UPI" | "Card" | "Net Banking" | "Others",
  "date": "YYYY-MM-DD",
  "confidence": float
}}
"""
    if api_key_openai:
        try:
            import openai
            client = openai.OpenAI(api_key=api_key_openai)
            res = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            data = json.loads(res.choices[0].message.content)
            data["raw_sms"] = sms_text
            data["parsed_by"] = "openai_sms"
            return data
        except Exception:
            pass

    return {
        "amount": 0.0,
        "type": "expense",
        "category": "Others",
        "merchant": "Unknown Merchant",
        "account_last4": "XXXX",
        "payment_method": "UPI",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "raw_sms": sms_text,
        "confidence": 0.30,
        "parsed_by": "sms_fallback"
    }

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        test_sms = [
            "Rs 250.00 debited from A/C XX1234 on 29-JUL-26 to Swiggy. Ref: 420912.",
            "Spent Rs 1,499.00 on HDFC Bank Card 5678 at AMAZON INDIA on 29-JUL-26.",
            "Alert: Your A/C 9876 credited by Rs 50,000.00 on 29/07/2026 by SALARY.",
            "Paid Rs 450 to Shell Petrol Pump via UPI Ref 88127391."
        ]
        print("=== Running SMS Extractor Test ===")
        for sms in test_sms:
            res = parse_sms_ai(sms)
            print(f"SMS: '{sms}' => Output:\n{json.dumps(res, indent=2)}")
        return

    sms_input = ""
    if len(sys.argv) > 1:
        sms_input = " ".join(sys.argv[1:])
    else:
        sms_input = sys.stdin.read().strip()

    if not sms_input:
        print(json.dumps({"error": "No SMS text provided"}))
        sys.exit(1)

    result = parse_sms_ai(sms_input)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
