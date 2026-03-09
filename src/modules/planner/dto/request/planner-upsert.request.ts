import { IsArray, IsObject } from 'class-validator';

export class PlannerUpsertRequest {
  @IsObject()
  payrollConfig: Record<string, unknown>;

  @IsArray()
  fixedExpenses: Array<Record<string, unknown>>;

  @IsArray()
  extraIncomes: Array<Record<string, unknown>>;
}
