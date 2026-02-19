import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class ListSchedulesUseCase {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async execute(tenantId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { tenantId },
      order: { nextDueDate: 'ASC', createdAt: 'DESC' },
    });
  }
}
