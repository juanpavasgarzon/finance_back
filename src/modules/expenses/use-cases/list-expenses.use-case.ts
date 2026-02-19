import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from '../entities/expense.entity';

@Injectable()
export class ListExpensesUseCase {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async execute(tenantId: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { tenantId },
      relations: ['category'],
      order: { dueDate: 'ASC', createdAt: 'DESC' },
    });
  }
}
