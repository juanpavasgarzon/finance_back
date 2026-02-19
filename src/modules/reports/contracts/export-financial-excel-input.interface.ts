import type { ReportPeriod } from './report-period.types';

export interface ExportFinancialExcelInput {
  tenantId: string;
  period: ReportPeriod;
  referenceDate: Date;
}
