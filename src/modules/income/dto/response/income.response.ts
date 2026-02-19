import { Income } from '../../entities/income.entity';

export class IncomeResponse {
  id: string;
  categoryId: string;
  amount: string;
  currencyCode: string;
  paidAt: string | null;
  scheduleId: string | null;
  description: string | null;
  dueDate: string | null;
  createdAt: string;

  constructor(income: Income) {
    this.id = income.id;
    this.categoryId = income.categoryId;
    this.amount = income.amount;
    this.currencyCode = income.currencyCode;
    this.paidAt = income.paidAt?.toISOString() ?? null;
    this.scheduleId = income.scheduleId;
    this.description = income.description;
    this.dueDate = income.dueDate ? new Date(income.dueDate).toISOString().slice(0, 10) : null;
    this.createdAt = income.createdAt.toISOString();
  }
}
