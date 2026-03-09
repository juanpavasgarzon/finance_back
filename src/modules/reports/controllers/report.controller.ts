import { Controller, Get, Query, StreamableFile } from '@nestjs/common';

import { CurrentTenantId } from 'shared';

import { FinancialReportQueryRequest } from '../dto/request/financial-report-query.request';
import { DashboardResponse } from '../dto/response/dashboard.response';
import { ExportFinancialExcelUseCase } from '../use-cases/export-financial-excel.use-case';
import { GetDashboardDataUseCase } from '../use-cases/get-dashboard-data.use-case';

const EXCEL_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/** Parse a date-only string (YYYY-MM-DD) as local time instead of UTC. */
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

@Controller('reports')
export class ReportController {
  constructor(
    private readonly exportFinancialExcelUseCase: ExportFinancialExcelUseCase,
    private readonly getDashboardDataUseCase: GetDashboardDataUseCase,
  ) {}

  @Get('dashboard')
  async getDashboard(@CurrentTenantId() tenantId: string, @Query() query: FinancialReportQueryRequest): Promise<DashboardResponse> {
    const referenceDate = query.date ? parseLocalDate(query.date) : new Date();
    return this.getDashboardDataUseCase.execute({
      tenantId,
      period: query.period,
      referenceDate,
    });
  }

  @Get('financial/excel')
  async getFinancialExcel(@CurrentTenantId() tenantId: string, @Query() query: FinancialReportQueryRequest): Promise<StreamableFile> {
    const referenceDate = query.date ? parseLocalDate(query.date) : new Date();
    const buffer = await this.exportFinancialExcelUseCase.execute({
      tenantId,
      period: query.period,
      referenceDate,
    });
    const filename = `estado-financiero-${query.period}-${referenceDate.toISOString().slice(0, 10)}.xlsx`;
    return new StreamableFile(buffer, {
      type: EXCEL_MIME,
      disposition: `attachment; filename="${filename}"`,
    });
  }
}
