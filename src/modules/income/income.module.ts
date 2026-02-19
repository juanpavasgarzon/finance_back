import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IncomeController } from './controllers/income.controller';
import { Income } from './entities/income.entity';
import { IncomeService } from './services/income.service';
import { CreateIncomeUseCase } from './use-cases/create-income.use-case';
import { GetIncomeByIdUseCase } from './use-cases/get-income-by-id.use-case';
import { ListIncomesUseCase } from './use-cases/list-incomes.use-case';
import { MarkIncomeAsPaidUseCase } from './use-cases/mark-income-as-paid.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Income])],
  controllers: [IncomeController],
  providers: [CreateIncomeUseCase, GetIncomeByIdUseCase, ListIncomesUseCase, MarkIncomeAsPaidUseCase, IncomeService],
  exports: [IncomeService],
})
export class IncomeModule {}
