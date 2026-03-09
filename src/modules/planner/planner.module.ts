import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from 'modules/categories';
import { Expense } from 'modules/expenses';
import { Income } from 'modules/income';

import { PlannerController } from './controllers/planner.controller';
import { PlannerConfig } from './entities/planner-config.entity';
import { GetPlannerConfigUseCase } from './use-cases/get-planner-config.use-case';
import { SyncPlannerDataUseCase } from './use-cases/sync-planner-data.use-case';
import { UpsertPlannerConfigUseCase } from './use-cases/upsert-planner-config.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PlannerConfig, Category, Expense, Income])],
  controllers: [PlannerController],
  providers: [GetPlannerConfigUseCase, UpsertPlannerConfigUseCase, SyncPlannerDataUseCase],
})
export class PlannerModule {}
