import type { CurrencyCode } from 'shared/constants/currency.constants';

export interface CreateIncomeFromScheduleInput {
  tenantId: string;
  categoryId: string;
  amount: string;
  currencyCode: CurrencyCode;
  scheduleId: string;
  description: string | null;
  dueDate: Date;
}
