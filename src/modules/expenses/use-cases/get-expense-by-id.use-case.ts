import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from '../entities/expense.entity';

@Injectable()
export class GetExpenseByIdUseCase {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async execute(expenseId: string, tenantId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, tenantId },
      relations: ['category'],
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }
}
