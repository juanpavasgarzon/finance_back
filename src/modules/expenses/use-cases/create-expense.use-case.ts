import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateExpenseInput } from '../contracts/create-expense-input.interface';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class CreateExpenseUseCase {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async execute(input: CreateExpenseInput): Promise<Expense> {
    const expense = this.expenseRepository.create({
      tenantId: input.tenantId,
      categoryId: input.categoryId,
      amount: input.amount,
      currencyCode: input.currencyCode,
      paidAt: null,
      scheduleId: input.scheduleId ?? null,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
    });
    return this.expenseRepository.save(expense);
  }
}
