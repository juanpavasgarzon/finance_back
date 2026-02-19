import type { DashboardSummaryParams } from '../../contracts/dashboard-summary-params.interface';

export class DashboardSummaryResponse {
  period: string;
  dateFrom: string;
  dateTo: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  currencyCode: string;

  constructor(params: DashboardSummaryParams) {
    this.period = params.period;
    this.dateFrom = params.dateFrom.toISOString().slice(0, 10);
    this.dateTo = params.dateTo.toISOString().slice(0, 10);
    this.totalIncome = params.totalIncome;
    this.totalExpenses = params.totalExpenses;
    this.balance = params.balance;
    this.currencyCode = params.currencyCode;
  }
}
