import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class DeleteScheduleUseCase {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async execute(tenantId: string, scheduleId: string): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId, tenantId },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.scheduleRepository.delete({ id: scheduleId, tenantId });
  }
}
