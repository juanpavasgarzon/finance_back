import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Income } from '../entities/income.entity';

@Injectable()
export class DeleteIncomeUseCase {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async execute(tenantId: string, incomeId: string): Promise<void> {
    const income = await this.incomeRepository.findOne({
      where: { id: incomeId, tenantId },
    });

    if (!income) {
      throw new NotFoundException('Income not found');
    }

    try {
      await this.incomeRepository.delete({ id: incomeId, tenantId });
    } catch (error: unknown) {
      if (error instanceof QueryFailedError && (error as QueryFailedError & { code: string }).code === '23503') {
        throw new ConflictException('Income has related records and cannot be deleted');
      }

      throw error;
    }
  }
}
