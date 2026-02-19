import type { CurrencyCode } from 'shared/constants/currency.constants';

export interface CreateExpenseInput {
  tenantId: string;
  categoryId: string;
  amount: string;
  currencyCode: CurrencyCode;
  description?: string;
  dueDate?: Date;
  scheduleId?: string;
}
