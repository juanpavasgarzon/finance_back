import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { UpsertPlannerInput } from '../contracts/upsert-planner-input.interface';
import { PlannerConfig } from '../entities/planner-config.entity';

@Injectable()
export class UpsertPlannerConfigUseCase {
  constructor(
    @InjectRepository(PlannerConfig)
    private readonly plannerConfigRepository: Repository<PlannerConfig>,
  ) {}

  async execute(input: UpsertPlannerInput): Promise<PlannerConfig> {
    const existing = await this.plannerConfigRepository.findOne({ where: { tenantId: input.tenantId } });

    if (existing) {
      existing.payrollConfig = input.payrollConfig;
      existing.fixedExpenses = input.fixedExpenses;
      existing.extraIncomes = input.extraIncomes;
      return this.plannerConfigRepository.save(existing);
    }

    const config = this.plannerConfigRepository.create({
      tenantId: input.tenantId,
      payrollConfig: input.payrollConfig,
      fixedExpenses: input.fixedExpenses,
      extraIncomes: input.extraIncomes,
    });
    return this.plannerConfigRepository.save(config);
  }
}
