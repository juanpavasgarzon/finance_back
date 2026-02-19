import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from '../entities/expense.entity';

@Injectable()
export class MarkExpenseAsPaidUseCase {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async execute(expenseId: string, tenantId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, tenantId },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    expense.paidAt = new Date();
    return this.expenseRepository.save(expense);
  }
}
