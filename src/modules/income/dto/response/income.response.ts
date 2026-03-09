import { Income } from '../../entities/income.entity';

export class IncomeResponse {
  id: string;
  categoryId: string;
  name: string;
  amount: string;
  paidAt: string | null;
  scheduleId: string | null;
  description: string | null;
  dueDate: string | null;
  createdAt: string;

  constructor(income: Income) {
    this.id = income.id;
    this.categoryId = income.categoryId;
    this.name = income.name;
    this.amount = income.amount;
    this.paidAt = income.paidAt?.toISOString() ?? null;
    this.scheduleId = income.scheduleId;
    this.description = income.description;
    this.dueDate = income.dueDate ? new Date(income.dueDate).toISOString().slice(0, 10) : null;
    this.createdAt = income.createdAt.toISOString();
  }
}
