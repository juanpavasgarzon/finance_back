import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PlannerConfig } from '../entities/planner-config.entity';

@Injectable()
export class GetPlannerConfigUseCase {
  constructor(
    @InjectRepository(PlannerConfig)
    private readonly plannerConfigRepository: Repository<PlannerConfig>,
  ) {}

  async execute(tenantId: string): Promise<PlannerConfig | null> {
    return this.plannerConfigRepository.findOne({ where: { tenantId } });
  }
}
