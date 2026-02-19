export interface ExpenseForReportItem {
  categoryId: string;
  categoryName: string;
  amount: string;
  currencyCode: string;
  paidAt: Date | null;
  dueDate: Date | null;
  createdAt: Date;
  description: string | null;
}
