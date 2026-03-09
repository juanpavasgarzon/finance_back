import { Body, Controller, Get, HttpCode, Post, Put } from '@nestjs/common';

import { CurrentTenantId } from 'shared';

import type { SyncPlannerResult } from '../contracts/sync-planner-result.interface';
import { PlannerUpsertRequest } from '../dto/request/planner-upsert.request';
import { PlannerResponse } from '../dto/response/planner.response';
import { GetPlannerConfigUseCase } from '../use-cases/get-planner-config.use-case';
import { SyncPlannerDataUseCase } from '../use-cases/sync-planner-data.use-case';
import { UpsertPlannerConfigUseCase } from '../use-cases/upsert-planner-config.use-case';

@Controller('planner')
export class PlannerController {
  constructor(
    private readonly getPlannerConfigUseCase: GetPlannerConfigUseCase,
    private readonly upsertPlannerConfigUseCase: UpsertPlannerConfigUseCase,
    private readonly syncPlannerDataUseCase: SyncPlannerDataUseCase,
  ) {}

  @Get()
  async get(@CurrentTenantId() tenantId: string): Promise<PlannerResponse> {
    const config = await this.getPlannerConfigUseCase.execute(tenantId);
    return new PlannerResponse(config);
  }

  @Put()
  async upsert(@CurrentTenantId() tenantId: string, @Body() request: PlannerUpsertRequest): Promise<PlannerResponse> {
    const config = await this.upsertPlannerConfigUseCase.execute({
      tenantId,
      payrollConfig: request.payrollConfig,
      fixedExpenses: request.fixedExpenses,
      extraIncomes: request.extraIncomes,
    });
    return new PlannerResponse(config);
  }

  @Post('sync')
  @HttpCode(200)
  async sync(@CurrentTenantId() tenantId: string): Promise<SyncPlannerResult> {
    return this.syncPlannerDataUseCase.execute(tenantId);
  }
}
