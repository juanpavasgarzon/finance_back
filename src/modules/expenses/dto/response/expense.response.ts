import { Expense } from '../../entities/expense.entity';

export class ExpenseResponse {
  id: string;
  categoryId: string;
  amount: string;
  currencyCode: string;
  paidAt: string | null;
  scheduleId: string | null;
  description: string | null;
  dueDate: string | null;
  createdAt: string;

  constructor(expense: Expense) {
    this.id = expense.id;
    this.categoryId = expense.categoryId;
    this.amount = expense.amount;
    this.currencyCode = expense.currencyCode;
    this.paidAt = expense.paidAt?.toISOString() ?? null;
    this.scheduleId = expense.scheduleId;
    this.description = expense.description;
    this.dueDate = expense.dueDate ? new Date(expense.dueDate).toISOString().slice(0, 10) : null;
    this.createdAt = expense.createdAt.toISOString();
  }
}
