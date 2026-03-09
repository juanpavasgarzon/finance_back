import { Injectable } from '@nestjs/common';

import { ExpensesService } from 'modules/expenses';
import { IncomeService } from 'modules/income';

import type { CategoryAggregateItem } from '../contracts/category-aggregate-item.interface';
import type { DateRange } from '../contracts/date-range.interface';
import type { EffectiveDateRow } from '../contracts/effective-date-row.interface';
import type { GetDashboardDataInput } from '../contracts/get-dashboard-data-input.interface';
import { CategoryBreakdownItemResponse } from '../dto/response/category-breakdown-item.response';
import { DashboardSummaryResponse } from '../dto/response/dashboard-summary.response';
import { DashboardResponse } from '../dto/response/dashboard.response';
import { getDateRangeForPeriod } from '../utils/date-range-by-period.util';

function effectiveDate(row: EffectiveDateRow): Date {
  if (row.paidAt) {
    return new Date(row.paidAt);
  }

  if (row.dueDate) {
    return new Date(row.dueDate);
  }

  return new Date(row.createdAt);
}

function inRange(date: Date, range: DateRange): boolean {
  const d = date.getTime();
  return d >= range.start.getTime() && d <= range.end.getTime();
}

@Injectable()
export class GetDashboardDataUseCase {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly incomeService: IncomeService,
  ) {}

  async execute(input: GetDashboardDataInput): Promise<DashboardResponse> {
    const range = getDateRangeForPeriod(input.period, input.referenceDate);
    const results = await Promise.all([
      this.expensesService.listByTenantForReport(input.tenantId),
      this.incomeService.listByTenantForReport(input.tenantId),
    ]);
    const expensesRaw = results[0];
    const incomesRaw = results[1];
    const expenses = expensesRaw.filter((e) => inRange(effectiveDate(e), range));
    const incomes = incomesRaw.filter((e) => inRange(effectiveDate(e), range));

    const totalIncome = incomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const balance = totalIncome - totalExpenses;

    const expensesByCategory = this.aggregateByCategory(expenses);
    const incomesByCategory = this.aggregateByCategory(incomes);

    const summary = new DashboardSummaryResponse({
      period: input.period,
      dateFrom: range.start,
      dateTo: range.end,
      totalIncome,
      totalExpenses,
      balance,
    });

    return new DashboardResponse({
      summary,
      expensesByCategory,
      incomesByCategory,
    });
  }

  private aggregateByCategory(items: CategoryAggregateItem[]): CategoryBreakdownItemResponse[] {
    const map = new Map<string, { name: string; total: number; count: number }>();

    for (const item of items) {
      const key = item.categoryId;
      const existing = map.get(key);
      const amount = parseFloat(item.amount) || 0;
      const name = item.categoryName;
      if (!existing) {
        map.set(key, {
          name,
          total: amount,
          count: 1,
        });
      }

      if (existing) {
        existing.total += amount;
        existing.count += 1;
      }
    }

    return Array.from(map.entries()).map(
      ([categoryId, value]) =>
        new CategoryBreakdownItemResponse({
          categoryId,
          categoryName: value.name,
          total: value.total,
          count: value.count,
        }),
    );
  }
}
