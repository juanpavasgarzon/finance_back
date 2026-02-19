import type { ReportPeriod } from './report-period.types';

export interface GetDashboardDataInput {
  tenantId: string;
  period: ReportPeriod;
  referenceDate: Date;
}
