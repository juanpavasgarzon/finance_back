import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Expense } from '../entities/expense.entity';

@Injectable()
export class DeleteExpenseUseCase {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async execute(tenantId: string, expenseId: string): Promise<void> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, tenantId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    try {
      await this.expenseRepository.delete({ id: expenseId, tenantId });
    } catch (error: unknown) {
      if (error instanceof QueryFailedError && (error as QueryFailedError & { code: string }).code === '23503') {
        throw new ConflictException('Expense has related records and cannot be deleted');
      }

      throw error;
    }
  }
}
