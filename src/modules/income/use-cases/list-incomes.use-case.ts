import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Income } from '../entities/income.entity';

@Injectable()
export class ListIncomesUseCase {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async execute(tenantId: string): Promise<Income[]> {
    return this.incomeRepository.find({
      where: { tenantId },
      relations: ['category'],
      order: { dueDate: 'ASC', createdAt: 'DESC' },
    });
  }
}
