import type { DashboardResponseParams } from '../../contracts/dashboard-response-params.interface';

export class DashboardResponse {
  summary: DashboardResponseParams['summary'];
  expensesByCategory: DashboardResponseParams['expensesByCategory'];
  incomesByCategory: DashboardResponseParams['incomesByCategory'];

  constructor(params: DashboardResponseParams) {
    this.summary = params.summary;
    this.expensesByCategory = params.expensesByCategory;
    this.incomesByCategory = params.incomesByCategory;
  }
}
