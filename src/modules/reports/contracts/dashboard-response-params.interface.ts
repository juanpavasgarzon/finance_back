import type { CategoryBreakdownItemResponse } from '../dto/response/category-breakdown-item.response';
import type { DashboardSummaryResponse } from '../dto/response/dashboard-summary.response';

export interface DashboardResponseParams {
  summary: DashboardSummaryResponse;
  expensesByCategory: CategoryBreakdownItemResponse[];
  incomesByCategory: CategoryBreakdownItemResponse[];
}
