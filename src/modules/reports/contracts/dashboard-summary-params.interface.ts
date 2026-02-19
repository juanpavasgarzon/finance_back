export interface DashboardSummaryParams {
  period: string;
  dateFrom: Date;
  dateTo: Date;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  currencyCode: string;
}
