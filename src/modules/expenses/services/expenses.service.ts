import { Injectable } from '@nestjs/common';

import type { CreateExpenseFromScheduleInput } from '../contracts/create-expense-from-schedule.interface';
import type { ExpenseForReportItem } from '../contracts/expense-for-report.interface';
import { CreateExpenseUseCase } from '../use-cases/create-expense.use-case';
import { ListExpensesUseCase } from '../use-cases/list-expenses.use-case';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly listExpensesUseCase: ListExpensesUseCase,
  ) {}

  async createFromSchedule(input: CreateExpenseFromScheduleInput): Promise<void> {
    await this.createExpenseUseCase.execute({
      tenantId: input.tenantId,
      categoryId: input.categoryId,
      amount: input.amount,
      currencyCode: input.currencyCode,
      scheduleId: input.scheduleId,
      description: input.description ?? undefined,
      dueDate: input.dueDate,
    });
  }

  async listByTenantForReport(tenantId: string): Promise<ExpenseForReportItem[]> {
    const expenses = await this.listExpensesUseCase.execute(tenantId);
    return expenses.map((e) => ({
      categoryId: e.categoryId,
      categoryName: e.category?.name ?? 'Sin categoría',
      amount: e.amount,
      currencyCode: e.currencyCode,
      paidAt: e.paidAt,
      dueDate: e.dueDate,
      createdAt: e.createdAt,
      description: e.description,
    }));
  }
}
