import { execFile } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';
import { NLPParseResult, SMSParseResult, AIAssistantResponse } from '@expense-tracker/shared';

dotenv.config();

const PYTHON_BIN = process.env.PYTHON_EXECUTABLE || 
  (process.platform === 'win32' 
    ? 'C:\\Users\\Kartik\\AppData\\Local\\Programs\\Python\\Python312\\python.exe' 
    : 'python3');

const NLP_DIR = path.join(__dirname, '../nlp');

export class PythonNlpBridge {
  
  /**
   * Executes a Python script asynchronously and returns parsed JSON stdout output.
   */
  private static runScript<T>(scriptName: string, args: string[], inputPayload?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(NLP_DIR, scriptName);
      
      const child = execFile(PYTHON_BIN, [scriptPath, ...args], {
        env: {
          ...process.env,
          PYTHONIOENCODING: 'utf-8'
        }
      }, (error, stdout, stderr) => {
        if (error && !stdout) {
          console.warn(`[PythonNlpBridge] Error running ${scriptName}:`, stderr || error.message);
          return reject(error);
        }

        try {
          const parsed = JSON.parse(stdout.trim());
          resolve(parsed as T);
        } catch (parseErr) {
          console.warn(`[PythonNlpBridge] Failed to parse JSON stdout from ${scriptName}:`, stdout);
          reject(parseErr);
        }
      });

      if (inputPayload && child.stdin) {
        child.stdin.write(JSON.stringify(inputPayload));
        child.stdin.end();
      }
    });
  }

  /**
   * Parse natural language text or voice transcript via extract_nlp.py
   */
  public static async parseNaturalLanguage(text: string): Promise<NLPParseResult> {
    try {
      return await this.runScript<NLPParseResult>('extract_nlp.py', [text]);
    } catch (err) {
      console.warn('[PythonNlpBridge] Falling back to Node.js regex NLP parser');
      // Emergency TS fallback
      const amountMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d{1,2})?)/i);
      const amt = amountMatch ? parseFloat(amountMatch[1]) : 0;
      return {
        amount: amt,
        type: text.toLowerCase().includes('salary') || text.toLowerCase().includes('received') ? 'income' : 'expense',
        category: text.toLowerCase().includes('food') || text.toLowerCase().includes('lunch') ? 'Food' : 'Others',
        merchant: 'General Merchant',
        payment_method: 'UPI',
        date: new Date().toISOString().split('T')[0],
        description: text,
        confidence: 0.70,
        parsed_by: 'ts_emergency_fallback'
      };
    }
  }

  /**
   * Parse Indian Bank SMS via extract_sms.py
   */
  public static async parseSms(smsText: string): Promise<SMSParseResult> {
    try {
      return await this.runScript<SMSParseResult>('extract_sms.py', [smsText]);
    } catch (err) {
      console.warn('[PythonNlpBridge] Falling back to Node.js regex SMS parser');
      const amtMatch = smsText.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i);
      const amt = amtMatch ? parseFloat(amtMatch[1].replace(/,/g, '')) : 0;
      return {
        amount: amt,
        type: smsText.toLowerCase().includes('credited') ? 'income' : 'expense',
        category: 'Others',
        merchant: 'Bank SMS',
        account_last4: 'XXXX',
        payment_method: 'UPI',
        date: new Date().toISOString().split('T')[0],
        raw_sms: smsText,
        confidence: 0.60,
        parsed_by: 'ts_sms_fallback'
      };
    }
  }

  /**
   * Query financial assistant via assistant_qa.py
   */
  public static async queryAssistant(query: string, context: any): Promise<AIAssistantResponse> {
    try {
      return await this.runScript<AIAssistantResponse>('assistant_qa.py', [], { query, context });
    } catch (err) {
      console.warn('[PythonNlpBridge] Falling back to Node.js assistant response');
      return {
        answer: `Processed query: "${query}". Your recent financial data is active.`,
        recommendation: 'Ask questions like "How much did I spend on food?" to get instant category insights.',
        parsed_by: 'ts_assistant_fallback'
      };
    }
  }
}
