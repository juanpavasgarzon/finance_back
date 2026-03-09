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
      name: input.name,
      amount: input.amount,
      paidAt: input.scheduleId ? null : input.paidAt !== undefined ? input.paidAt : new Date(),
      scheduleId: input.scheduleId ?? null,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
    });
    return this.expenseRepository.save(expense);
  }
}
