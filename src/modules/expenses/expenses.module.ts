import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpenseController } from './controllers/expense.controller';
import { Expense } from './entities/expense.entity';
import { ExpensesService } from './services/expenses.service';
import { CreateExpenseUseCase } from './use-cases/create-expense.use-case';
import { GetExpenseByIdUseCase } from './use-cases/get-expense-by-id.use-case';
import { ListExpensesUseCase } from './use-cases/list-expenses.use-case';
import { MarkExpenseAsPaidUseCase } from './use-cases/mark-expense-as-paid.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpenseController],
  providers: [CreateExpenseUseCase, GetExpenseByIdUseCase, ListExpensesUseCase, MarkExpenseAsPaidUseCase, ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
