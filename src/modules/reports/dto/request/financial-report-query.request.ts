import { IsDateString, IsIn, IsOptional } from 'class-validator';

import { REPORT_PERIODS } from 'modules/reports';

export class FinancialReportQueryRequest {
  @IsIn(REPORT_PERIODS)
  period: (typeof REPORT_PERIODS)[number];

  @IsOptional()
  @IsDateString()
  date?: string;
}
