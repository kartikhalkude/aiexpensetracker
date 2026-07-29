import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { TransactionController } from '../controllers/transaction.controller';
import { CategoryController } from '../controllers/category.controller';
import { BudgetController } from '../controllers/budget.controller';
import { AIController } from '../controllers/ai.controller';
import { AnalyticsController } from '../controllers/analytics.controller';
import { ExportController } from '../controllers/export.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';

const router = Router();

// Auth Routes
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/profile', authenticateJwt, AuthController.getProfile);

// Transaction Routes
router.get('/transactions', authenticateJwt, TransactionController.getTransactions);
router.post('/transactions', authenticateJwt, TransactionController.createTransaction);
router.delete('/transactions/:id', authenticateJwt, TransactionController.deleteTransaction);

// Category & Budget Routes
router.get('/categories', authenticateJwt, CategoryController.getCategories);
router.get('/budgets', authenticateJwt, BudgetController.getBudgets);
router.post('/budgets', authenticateJwt, BudgetController.createOrUpdateBudget);

// AI & Python NLP Suite Routes
router.post('/ai/parse-nlp', AIController.parseNaturalLanguage);
router.post('/ai/parse-sms', AIController.parseSMS);
router.post('/ai/assistant-query', authenticateJwt, AIController.assistantQuery);

// Analytics & Reports Routes
router.get('/analytics/summary', authenticateJwt, AnalyticsController.getSummary);
router.get('/reports/export-csv', authenticateJwt, ExportController.exportCSV);

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Smart Expense Tracker AI Backend',
    timestamp: new Date().toISOString()
  });
});

export default router;
