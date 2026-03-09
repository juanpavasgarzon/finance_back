export interface IncomeForReportItem {
  categoryId: string;
  categoryName: string;
  name: string;
  amount: string;
  paidAt: Date | null;
  dueDate: Date | null;
  createdAt: Date;
  description: string | null;
}
