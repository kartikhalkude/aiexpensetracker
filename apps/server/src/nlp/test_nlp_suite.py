#!/usr/bin/env python3
"""
Smart Expense Tracker AI - Batch NLP/SMS Test Suite
Run all extraction tests and print a comprehensive report.
"""

import sys
import json
import os
sys.path.insert(0, os.path.dirname(__file__))

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# -----------------------------------------------
# Test Data
# -----------------------------------------------

NLP_TEST_CASES = [
    # (input_text, expected_type, expected_category)
    ("Spent 250 on lunch", "expense", "Food"),
    ("I spent 500 rupees on groceries yesterday", "expense", "Food"),
    ("Received salary of 75000 from company", "income", "Salary"),
    ("Paid electricity bill of 1800 via UPI", "expense", "Utilities"),
    ("Paid Netflix subscription 499", "expense", "Subscription"),
    ("Booked Uber cab for 180 rupees", "expense", "Travel"),
    ("Purchased petrol for 2000 at HPCL", "expense", "Fuel"),
    ("Bought shoes from Amazon for 2499", "expense", "Shopping"),
]

SMS_TEST_CASES = [
    # (sms_text, expected_type, expected_merchant_hint)
    (
        "Rs 250.00 debited from A/C XX1234 on 29-JUL-26 to Swiggy. Ref: 420912.",
        "expense", "Swiggy"
    ),
    (
        "Spent Rs 1,499.00 on HDFC Bank Card 5678 at AMAZON INDIA on 29-JUL-26.",
        "expense", "Amazon"
    ),
    (
        "Alert: Your A/C 9876 credited by Rs 50,000.00 on 29/07/2026 by SALARY.",
        "income", "50000"
    ),
    (
        "Paid Rs 450 to Shell Petrol Pump via UPI Ref 88127391.",
        "expense", "Shell"
    ),
    (
        "ICICI Bank: INR 1200.00 debited from Acct XX7890 to NETFLIX on 29-07-2026.",
        "expense", "Netflix"
    ),
]

ASSISTANT_QA_CASES = [
    ("How much did I spend on food?", "food"),
    ("Can I spend another 5000?", "balance"),
    ("Which category is highest?", "highest"),
]

SAMPLE_CONTEXT = {
    "transactions": [
        {"amount": 250, "category": "Food", "merchant": "Swiggy", "type": "expense", "date": "2026-07-29"},
        {"amount": 1499, "category": "Shopping", "merchant": "Amazon", "type": "expense", "date": "2026-07-29"},
        {"amount": 450, "category": "Fuel", "merchant": "Shell", "type": "expense", "date": "2026-07-29"},
        {"amount": 1200, "category": "Subscription", "merchant": "Netflix", "type": "expense", "date": "2026-07-29"},
        {"amount": 50000, "category": "Salary", "merchant": "Employer", "type": "income", "date": "2026-07-29"},
    ],
    "budgets": [
        {"category": "Food", "monthly_limit": 10000, "spent_amount": 250},
    ]
}


def run_nlp_tests():
    from extract_nlp import ai_extract_nlp
    print("\n" + "="*60)
    print("  NLP ENTITY EXTRACTION TEST SUITE")
    print("="*60)
    passed = 0
    for i, (text, exp_type, exp_cat) in enumerate(NLP_TEST_CASES):
        result = ai_extract_nlp(text)
        ok_type = result.get("type") == exp_type
        ok_cat = result.get("category") == exp_cat
        ok = ok_type and ok_cat
        if ok:
            passed += 1
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] [{i+1}/{len(NLP_TEST_CASES)}] '{text[:45]}...'")
        if not ok:
            print(f"       Expected type={exp_type}, category={exp_cat}")
            print(f"       Got     type={result.get('type')}, category={result.get('category')}")
        else:
            print(f"       => amount={result['amount']}, merchant={result['merchant']}, engine={result['parsed_by']}")
    print(f"\nNLP Tests: {passed}/{len(NLP_TEST_CASES)} passed\n")
    return passed, len(NLP_TEST_CASES)


def run_sms_tests():
    from extract_sms import parse_sms_ai
    print("="*60)
    print("  BANK SMS PARSER TEST SUITE")
    print("="*60)
    passed = 0
    for i, (sms, exp_type, hint) in enumerate(SMS_TEST_CASES):
        result = parse_sms_ai(sms)
        ok_type = result.get("type") == exp_type
        ok_amt = result.get("amount", 0) > 0
        ok = ok_type and ok_amt
        if ok:
            passed += 1
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] [{i+1}/{len(SMS_TEST_CASES)}] '{sms[:55]}...'")
        if not ok:
            print(f"       Expected type={exp_type}, amount>0, hint='{hint}'")
            print(f"       Got     type={result.get('type')}, amount={result.get('amount')}")
        else:
            print(f"       => amount={result['amount']}, merchant={result['merchant']}, engine={result['parsed_by']}")
    print(f"\nSMS Tests: {passed}/{len(SMS_TEST_CASES)} passed\n")
    return passed, len(SMS_TEST_CASES)


def run_assistant_tests():
    from assistant_qa import answer_financial_query
    print("="*60)
    print("  AI FINANCIAL ASSISTANT Q&A TEST SUITE")
    print("="*60)
    passed = 0
    for i, (query, keyword) in enumerate(ASSISTANT_QA_CASES):
        result = answer_financial_query(query, SAMPLE_CONTEXT)
        ok = bool(result.get("answer")) and len(result["answer"]) > 10
        if ok:
            passed += 1
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] [{i+1}/{len(ASSISTANT_QA_CASES)}] Q: '{query}'")
        print(f"       A: {result.get('answer', 'No answer')[:80]}")
        if result.get("recommendation"):
            print(f"       Tip: {result['recommendation'][:60]}")
    print(f"\nAssistant Tests: {passed}/{len(ASSISTANT_QA_CASES)} passed\n")
    return passed, len(ASSISTANT_QA_CASES)


def main():
    print("\n" + "="*60)
    print("  SMART EXPENSE TRACKER AI - PYTHON NLP FULL TEST SUITE")
    print("="*60)

    total_passed = 0
    total_tests = 0

    p, t = run_nlp_tests()
    total_passed += p
    total_tests += t

    p, t = run_sms_tests()
    total_passed += p
    total_tests += t

    p, t = run_assistant_tests()
    total_passed += p
    total_tests += t

    print("="*60)
    print(f"  OVERALL: {total_passed}/{total_tests} tests passed")
    if total_passed == total_tests:
        print("  ALL TESTS PASSED! Python NLP Suite is production ready.")
    else:
        print(f"  {total_tests - total_passed} test(s) failed. Check output above for details.")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
