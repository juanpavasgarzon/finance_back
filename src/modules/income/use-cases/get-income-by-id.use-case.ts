import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Income } from '../entities/income.entity';

@Injectable()
export class GetIncomeByIdUseCase {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async execute(incomeId: string, tenantId: string): Promise<Income> {
    const income = await this.incomeRepository.findOne({
      where: { id: incomeId, tenantId },
      relations: ['category'],
    });
    if (!income) {
      throw new NotFoundException('Income not found');
    }

    return income;
  }
}
