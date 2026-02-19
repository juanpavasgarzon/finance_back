import type { CategoryType } from 'modules/categories';

import type { CurrencyCode } from 'shared/constants/currency.constants';

import type { RecurrenceUnit } from './recurrence-unit.types';

export interface CreateScheduleInput {
  tenantId: string;
  categoryId: string;
  type: CategoryType;
  amount: string;
  currencyCode: CurrencyCode;
  recurrenceInterval: number;
  recurrenceUnit: RecurrenceUnit;
  nextDueDate: Date;
  description?: string;
}
