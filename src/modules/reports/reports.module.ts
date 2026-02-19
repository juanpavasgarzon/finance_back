import { Module } from '@nestjs/common';

import { ExpensesModule } from 'modules/expenses';
import { IncomeModule } from 'modules/income';

import { ReportController } from './controllers/report.controller';
import { ExportFinancialExcelUseCase } from './use-cases/export-financial-excel.use-case';
import { GetDashboardDataUseCase } from './use-cases/get-dashboard-data.use-case';

@Module({
  imports: [ExpensesModule, IncomeModule],
  controllers: [ReportController],
  providers: [ExportFinancialExcelUseCase, GetDashboardDataUseCase],
  exports: [],
})
export class ReportsModule {}
