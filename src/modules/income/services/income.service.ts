import { Injectable } from '@nestjs/common';

import type { CreateIncomeFromScheduleInput } from '../contracts/create-income-from-schedule.interface';
import type { IncomeForReportItem } from '../contracts/income-for-report.interface';
import { CreateIncomeUseCase } from '../use-cases/create-income.use-case';
import { ListIncomesUseCase } from '../use-cases/list-incomes.use-case';

@Injectable()
export class IncomeService {
  constructor(
    private readonly createIncomeUseCase: CreateIncomeUseCase,
    private readonly listIncomesUseCase: ListIncomesUseCase,
  ) {}

  async createFromSchedule(input: CreateIncomeFromScheduleInput): Promise<void> {
    await this.createIncomeUseCase.execute({
      tenantId: input.tenantId,
      categoryId: input.categoryId,
      amount: input.amount,
      currencyCode: input.currencyCode,
      scheduleId: input.scheduleId,
      description: input.description ?? undefined,
      dueDate: input.dueDate,
    });
  }

  async listByTenantForReport(tenantId: string): Promise<IncomeForReportItem[]> {
    const incomes = await this.listIncomesUseCase.execute(tenantId);
    return incomes.map((i) => ({
      categoryId: i.categoryId,
      categoryName: i.category?.name ?? 'Sin categoría',
      amount: i.amount,
      currencyCode: i.currencyCode,
      paidAt: i.paidAt,
      dueDate: i.dueDate,
      createdAt: i.createdAt,
      description: i.description,
    }));
  }
}
