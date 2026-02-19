import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateScheduleInput } from '../contracts/create-schedule-input.interface';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class CreateScheduleUseCase {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async execute(input: CreateScheduleInput): Promise<Schedule> {
    const schedule = this.scheduleRepository.create({
      tenantId: input.tenantId,
      categoryId: input.categoryId,
      type: input.type,
      amount: input.amount,
      currencyCode: input.currencyCode,
      recurrenceInterval: input.recurrenceInterval,
      recurrenceUnit: input.recurrenceUnit,
      nextDueDate: input.nextDueDate,
      description: input.description ?? null,
    });
    return this.scheduleRepository.save(schedule);
  }
}
