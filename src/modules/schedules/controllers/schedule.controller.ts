import { Body, Controller, Get, Post } from '@nestjs/common';

import { CurrentTenantId } from 'shared';

import { ScheduleCreateRequest } from '../dto/request/schedule-create.request';
import { ScheduleResponse } from '../dto/response/schedule.response';
import { CreateScheduleUseCase } from '../use-cases/create-schedule.use-case';
import { ListSchedulesUseCase } from '../use-cases/list-schedules.use-case';

@Controller('schedules')
export class ScheduleController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly listSchedulesUseCase: ListSchedulesUseCase,
  ) {}

  @Get()
  async list(@CurrentTenantId() tenantId: string): Promise<ScheduleResponse[]> {
    const schedules = await this.listSchedulesUseCase.execute(tenantId);
    return schedules.map((schedule) => new ScheduleResponse(schedule));
  }

  @Post()
  async create(@CurrentTenantId() tenantId: string, @Body() request: ScheduleCreateRequest): Promise<ScheduleResponse> {
    const schedule = await this.createScheduleUseCase.execute({
      tenantId,
      categoryId: request.categoryId,
      type: request.type,
      amount: String(request.amount),
      currencyCode: request.currencyCode,
      recurrenceInterval: request.recurrenceInterval,
      recurrenceUnit: request.recurrenceUnit,
      nextDueDate: new Date(request.nextDueDate),
      description: request.description,
    });
    return new ScheduleResponse(schedule);
  }
}
