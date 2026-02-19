import { IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

import { CURRENCY_CODES } from 'shared/constants/currency.constants';

export class ExpenseCreateRequest {
  @IsUUID()
  categoryId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsIn(CURRENCY_CODES)
  currencyCode: (typeof CURRENCY_CODES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsUUID()
  scheduleId?: string;
}
