import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateIncomeInput } from '../contracts/create-income-input.interface';
import { Income } from '../entities/income.entity';

@Injectable()
export class CreateIncomeUseCase {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async execute(input: CreateIncomeInput): Promise<Income> {
    const income = this.incomeRepository.create({
      tenantId: input.tenantId,
      categoryId: input.categoryId,
      amount: input.amount,
      currencyCode: input.currencyCode,
      paidAt: null,
      scheduleId: input.scheduleId ?? null,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
    });
    return this.incomeRepository.save(income);
  }
}
