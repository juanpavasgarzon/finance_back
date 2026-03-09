import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

import { CATEGORY_TYPES } from 'modules/categories';
import { RECURRENCE_UNITS } from 'modules/schedules';

export class ScheduleCreateRequest {
  @IsUUID()
  categoryId: string;

  @IsIn(CATEGORY_TYPES)
  type: (typeof CATEGORY_TYPES)[number];

  @IsString()
  @MaxLength(200)
  name: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsInt()
  @Min(1)
  recurrenceInterval: number;

  @IsIn(RECURRENCE_UNITS)
  recurrenceUnit: (typeof RECURRENCE_UNITS)[number];

  @IsDateString()
  nextDueDate: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
