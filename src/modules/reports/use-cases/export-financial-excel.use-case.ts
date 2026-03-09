import { Injectable } from '@nestjs/common';
import { Workbook, Worksheet } from 'exceljs';

import { ExpensesService } from 'modules/expenses';
import { IncomeService } from 'modules/income';

import type { DateRange } from '../contracts/date-range.interface';
import type { EffectiveDateRow } from '../contracts/effective-date-row.interface';
import type { ExportFinancialExcelInput } from '../contracts/export-financial-excel-input.interface';
import { getDateRangeForPeriod } from '../utils/date-range-by-period.util';

const HEADER_FILL_BLUE = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF4472C4' } };
const HEADER_FILL_GREEN = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF70AD47' } };
const HEADER_FILL_RED = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFFF4444' } };
const HEADER_FONT = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
const TITLE_FONT = { bold: true, size: 14, color: { argb: 'FF333333' } };
const TOTAL_FILL = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFE8E8E8' } };
const BORDER_THIN = {
  top: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
  bottom: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
  left: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
  right: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
};
const CURRENCY_FORMAT = '#,##0';

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

function styleHeaderRow(sheet: Worksheet, rowNumber: number, fill: typeof HEADER_FILL_BLUE) {
  const row = sheet.getRow(rowNumber);
  row.eachCell((cell) => {
    cell.font = HEADER_FONT;
    cell.fill = fill;
    cell.border = BORDER_THIN;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  row.height = 28;
}

function styleDataRows(sheet: Worksheet, startRow: number, endRow: number) {
  for (let i = startRow; i <= endRow; i++) {
    const row = sheet.getRow(i);

    row.eachCell((cell) => {
      cell.border = BORDER_THIN;
      cell.alignment = { vertical: 'middle' };
    });

    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
      });
    }
  }
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

    const totalIngresos = incomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    const totalEgresos = expenses.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    const balance = totalIngresos - totalEgresos;

    const workbook = new Workbook();
    workbook.creator = 'Finance';
    workbook.created = new Date();

    this.buildSummarySheet(workbook, input, range, totalIngresos, totalEgresos, balance);
    this.buildTransactionSheet(workbook, 'Ingresos', incomes, HEADER_FILL_GREEN, totalIngresos);
    this.buildTransactionSheet(workbook, 'Egresos', expenses, HEADER_FILL_RED, totalEgresos);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private buildSummarySheet(
    workbook: Workbook,
    input: ExportFinancialExcelInput,
    range: DateRange,
    totalIngresos: number,
    totalEgresos: number,
    balance: number,
  ) {
    const sheet = workbook.addWorksheet('Resumen', {
      properties: { tabColor: { argb: 'FF4472C4' } },
    });

    sheet.columns = [
      { key: 'label', width: 28 },
      { key: 'value', width: 22 },
    ];

    sheet.mergeCells('A1:B1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'Finance — Resumen Financiero';
    titleCell.font = TITLE_FONT;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 36;

    sheet.addRow({});

    const headerRow = sheet.addRow({ label: 'Concepto', value: 'Detalle' });
    styleHeaderRow(sheet, headerRow.number, HEADER_FILL_BLUE);

    const dataStart = headerRow.number + 1;
    sheet.addRow({ label: 'Período', value: input.period });
    sheet.addRow({ label: 'Desde', value: formatDate(range.start) });
    sheet.addRow({ label: 'Hasta', value: formatDate(range.end) });
    sheet.addRow({});

    const incomeRow = sheet.addRow({ label: 'Total Ingresos', value: totalIngresos });
    incomeRow.getCell('value').numFmt = CURRENCY_FORMAT;
    incomeRow.getCell('value').font = { bold: true, color: { argb: 'FF70AD47' } };

    const expenseRow = sheet.addRow({ label: 'Total Egresos', value: totalEgresos });
    expenseRow.getCell('value').numFmt = CURRENCY_FORMAT;
    expenseRow.getCell('value').font = { bold: true, color: { argb: 'FFFF4444' } };

    sheet.addRow({});

    const balanceRow = sheet.addRow({ label: 'BALANCE', value: balance });
    balanceRow.getCell('label').font = { bold: true, size: 12 };
    balanceRow.getCell('value').numFmt = CURRENCY_FORMAT;
    balanceRow.getCell('value').font = { bold: true, size: 12, color: { argb: 'FF4472C4' } };
    balanceRow.eachCell((cell) => {
      cell.fill = TOTAL_FILL;
      cell.border = BORDER_THIN;
    });

    styleDataRows(sheet, dataStart, balanceRow.number - 1);
  }

  private buildTransactionSheet(
    workbook: Workbook,
    title: string,
    items: Array<EffectiveDateRow>,
    headerFill: typeof HEADER_FILL_GREEN,
    total: number,
  ) {
    const sheet = workbook.addWorksheet(title, {
      properties: { tabColor: { argb: headerFill.fgColor.argb } },
    });

    sheet.columns = [
      { key: 'name', width: 24 },
      { key: 'category', width: 20 },
      { key: 'amount', width: 16 },
      { key: 'date', width: 14 },
      { key: 'status', width: 12 },
      { key: 'description', width: 36 },
    ];

    sheet.mergeCells('A1:F1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = title;
    titleCell.font = TITLE_FONT;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 36;

    sheet.addRow({});

    const headerRow = sheet.addRow({
      name: 'Nombre',
      category: 'Categoría',
      amount: 'Monto',
      date: 'Fecha',
      status: 'Estado',
      description: 'Descripción',
    });
    styleHeaderRow(sheet, headerRow.number, headerFill);

    const dataStart = headerRow.number + 1;

    for (const item of items) {
      const row = sheet.addRow({
        name: item.name ?? '',
        category: item.categoryName,
        amount: parseFloat(item.amount),
        date: formatDate(effectiveDate(item)),
        status: item.paidAt ? 'Pagado' : 'Pendiente',
        description: item.description ?? '',
      });

      row.getCell('amount').numFmt = CURRENCY_FORMAT;
    }

    const dataEnd = dataStart + items.length - 1;

    if (items.length > 0) {
      styleDataRows(sheet, dataStart, dataEnd);
    }

    sheet.addRow({});

    const totalRow = sheet.addRow({
      name: '',
      category: 'TOTAL',
      amount: total,
      date: '',
      status: '',
      description: '',
    });

    totalRow.getCell('category').font = { bold: true, size: 11 };
    totalRow.getCell('amount').numFmt = CURRENCY_FORMAT;
    totalRow.getCell('amount').font = { bold: true, size: 11 };
    totalRow.eachCell((cell) => {
      cell.fill = TOTAL_FILL;
      cell.border = BORDER_THIN;
    });
  }
}
