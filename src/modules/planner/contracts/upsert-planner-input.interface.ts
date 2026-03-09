export interface UpsertPlannerInput {
  tenantId: string;
  payrollConfig: Record<string, unknown>;
  fixedExpenses: Array<Record<string, unknown>>;
  extraIncomes: Array<Record<string, unknown>>;
}
