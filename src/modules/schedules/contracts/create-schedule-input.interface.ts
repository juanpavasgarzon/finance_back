import type { CategoryType } from 'modules/categories';

import type { RecurrenceUnit } from './recurrence-unit.types';

export interface CreateScheduleInput {
  tenantId: string;
  categoryId: string;
  type: CategoryType;
  name: string;
  amount: string;
  recurrenceInterval: number;
  recurrenceUnit: RecurrenceUnit;
  nextDueDate: Date;
  startDate: Date;
  endDate?: Date;
  description?: string;
}
