import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

import { CurrentTenantId } from 'shared';

import { ScheduleCreateRequest } from '../dto/request/schedule-create.request';
import { ScheduleResponse } from '../dto/response/schedule.response';
import { CreateScheduleUseCase } from '../use-cases/create-schedule.use-case';
import { DeleteScheduleUseCase } from '../use-cases/delete-schedule.use-case';
import { ListSchedulesUseCase } from '../use-cases/list-schedules.use-case';

@Controller('schedules')
export class ScheduleController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly deleteScheduleUseCase: DeleteScheduleUseCase,
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
      name: request.name,
      amount: String(request.amount),
      recurrenceInterval: request.recurrenceInterval,
      recurrenceUnit: request.recurrenceUnit,
      nextDueDate: new Date(request.nextDueDate),
      startDate: new Date(request.startDate),
      endDate: request.endDate ? new Date(request.endDate) : undefined,
      description: request.description,
    });
    return new ScheduleResponse(schedule);
  }

  @Delete(':scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentTenantId() tenantId: string, @Param('scheduleId') scheduleId: string): Promise<void> {
    await this.deleteScheduleUseCase.execute(tenantId, scheduleId);
  }
}
