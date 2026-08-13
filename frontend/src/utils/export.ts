import type { Expense } from '../types/expense';

export function exportExpensesToCSV(expenses: Expense[]): void {
  if (!expenses.length) return;

  const headers = ['ID', 'Date', 'Category', 'Payment Method', 'Voice Logged', 'Detailed Description', 'Amount'];

  const csvRows = [
    headers.join(','),
    ...expenses.map((exp) =>
      [
        `"${exp.id}"`,
        `"${exp.date}"`,
        `"${exp.category}"`,
        `"${exp.paymentMethod}"`,
        exp.isVoiceLogged ? 'Yes' : 'No',
        `"${exp.description.replace(/"/g, '""')}"`,
        exp.amount,
      ].join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `PaperSpend_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
