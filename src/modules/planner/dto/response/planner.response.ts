import { PlannerConfig } from '../../entities/planner-config.entity';

export class PlannerResponse {
  payrollConfig: Record<string, unknown>;
  fixedExpenses: Array<Record<string, unknown>>;
  extraIncomes: Array<Record<string, unknown>>;

  constructor(entity: PlannerConfig | null) {
    this.payrollConfig = entity?.payrollConfig ?? {};
    this.fixedExpenses = entity?.fixedExpenses ?? [];
    this.extraIncomes = entity?.extraIncomes ?? [];
  }
}
