import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';

import { ExpensesService } from 'modules/expenses';
import { IncomeService } from 'modules/income';

import type { DateRange } from '../contracts/date-range.interface';
import type { EffectiveDateRow } from '../contracts/effective-date-row.interface';
import type { ExportFinancialExcelInput } from '../contracts/export-financial-excel-input.interface';
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

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

@Injectable()
export class ExportFinancialExcelUseCase {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly incomeService: IncomeService,
  ) {}

  async execute(input: ExportFinancialExcelInput): Promise<Buffer> {
    const range = getDateRangeForPeriod(input.period, input.referenceDate);
    const results = await Promise.all([
      this.expensesService.listByTenantForReport(input.tenantId),
      this.incomeService.listByTenantForReport(input.tenantId),
    ]);
    const expensesRaw = results[0];
    const incomesRaw = results[1];
    const expenses = expensesRaw.filter((e) => inRange(effectiveDate(e), range));
    const incomes = incomesRaw.filter((e) => inRange(effectiveDate(e), range));

    const totalIngresos = incomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const totalEgresos = expenses.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const balance = totalIngresos - totalEgresos;

    const workbook = new Workbook();
    workbook.creator = 'Finance Back';
    workbook.created = new Date();

    const resumenSheet = workbook.addWorksheet('Resumen', {
      properties: { tabColor: { argb: 'FF4472C4' } },
    });
    resumenSheet.columns = [
      { header: 'Concepto', key: 'concepto', width: 24 },
      { header: 'Valor', key: 'valor', width: 18 },
    ];
    resumenSheet.addRow({ concepto: 'Período', valor: input.period });
    resumenSheet.addRow({
      concepto: 'Desde',
      valor: formatDate(range.start),
    });
    resumenSheet.addRow({ concepto: 'Hasta', valor: formatDate(range.end) });
    resumenSheet.addRow({ concepto: '', valor: '' });
    resumenSheet.addRow({ concepto: 'Total ingresos', valor: totalIngresos });
    resumenSheet.addRow({ concepto: 'Total egresos', valor: totalEgresos });
    resumenSheet.addRow({ concepto: 'Balance', valor: balance });
    resumenSheet.addRow({ concepto: '', valor: '' });
    resumenSheet.addRow({
      concepto: '(Ahorros: ver módulo de ahorros cuando esté disponible)',
      valor: '',
    });

    const ingresosSheet = workbook.addWorksheet('Ingresos', {
      properties: { tabColor: { argb: 'FF70AD47' } },
    });
    ingresosSheet.columns = [
      { header: 'Fecha efectiva', key: 'fecha', width: 14 },
      { header: 'Categoría', key: 'categoria', width: 22 },
      { header: 'Monto', key: 'monto', width: 14 },
      { header: 'Moneda', key: 'moneda', width: 8 },
      { header: 'Pagado', key: 'pagado', width: 12 },
      { header: 'Descripción', key: 'descripcion', width: 36 },
    ];

    for (const i of incomes) {
      ingresosSheet.addRow({
        fecha: formatDate(effectiveDate(i)),
        categoria: i.categoryName,
        monto: parseFloat(i.amount),
        moneda: i.currencyCode,
        pagado: i.paidAt ? formatDate(new Date(i.paidAt)) : 'No',
        descripcion: i.description ?? '',
      });
    }

    const egresosSheet = workbook.addWorksheet('Egresos', {
      properties: { tabColor: { argb: 'FFFF0000' } },
    });
    egresosSheet.columns = [
      { header: 'Fecha efectiva', key: 'fecha', width: 14 },
      { header: 'Categoría', key: 'categoria', width: 22 },
      { header: 'Monto', key: 'monto', width: 14 },
      { header: 'Moneda', key: 'moneda', width: 8 },
      { header: 'Pagado', key: 'pagado', width: 12 },
      { header: 'Descripción', key: 'descripcion', width: 36 },
    ];

    for (const e of expenses) {
      egresosSheet.addRow({
        fecha: formatDate(effectiveDate(e)),
        categoria: e.categoryName,
        monto: parseFloat(e.amount),
        moneda: e.currencyCode,
        pagado: e.paidAt ? formatDate(new Date(e.paidAt)) : 'No',
        descripcion: e.description ?? '',
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
