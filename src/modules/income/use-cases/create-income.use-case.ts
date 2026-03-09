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
      name: input.name,
      amount: input.amount,
      paidAt: input.scheduleId ? null : input.paidAt !== undefined ? input.paidAt : new Date(),
      scheduleId: input.scheduleId ?? null,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
    });
    return this.incomeRepository.save(income);
  }
}
