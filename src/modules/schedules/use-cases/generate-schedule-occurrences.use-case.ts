import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThanOrEqual, Repository } from 'typeorm';

import type { CreateExpenseFromScheduleInput } from 'modules/expenses';
import { ExpensesService } from 'modules/expenses';
import type { CreateIncomeFromScheduleInput } from 'modules/income';
import { IncomeService } from 'modules/income';
import { NotificationsService, SCHEDULE_EXECUTED } from 'modules/notifications';

import { addRecurrence } from './next-due-date.util';
import type { ScheduleNextDueUpdate } from '../contracts/schedule-next-due-update.interface';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class GenerateScheduleOccurrencesUseCase {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly dataSource: DataSource,
    private readonly expensesService: ExpensesService,
    private readonly incomeService: IncomeService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async execute(upToDate: Date): Promise<void> {
    const schedules = await this.scheduleRepository.find({
      where: { nextDueDate: LessThanOrEqual(upToDate) },
      order: { tenantId: 'ASC', id: 'ASC' },
    });
    if (schedules.length === 0) {
      return;
    }

    const updates: ScheduleNextDueUpdate[] = [];

    for (const schedule of schedules) {
      const dueDate = new Date(schedule.nextDueDate);
      if (schedule.type === 'EXPENSE') {
        const input: CreateExpenseFromScheduleInput = {
          tenantId: schedule.tenantId,
          categoryId: schedule.categoryId,
          amount: schedule.amount,
          currencyCode: schedule.currencyCode,
          scheduleId: schedule.id,
          description: schedule.description,
          dueDate,
        };
        await this.expensesService.createFromSchedule(input);
      } else {
        const input: CreateIncomeFromScheduleInput = {
          tenantId: schedule.tenantId,
          categoryId: schedule.categoryId,
          amount: schedule.amount,
          currencyCode: schedule.currencyCode,
          scheduleId: schedule.id,
          description: schedule.description,
          dueDate,
        };
        await this.incomeService.createFromSchedule(input);
      }

      const nextDue = addRecurrence(dueDate, schedule.recurrenceInterval, schedule.recurrenceUnit);
      updates.push({ id: schedule.id, nextDueDate: nextDue });
    }

    await this.bulkUpdateNextDueDate(updates);
    await this.notifyTenantsOfOccurrences(schedules);
  }

  async executeForTenant(tenantId: string, upToDate: Date): Promise<void> {
    const schedules = await this.scheduleRepository.find({
      where: { tenantId, nextDueDate: LessThanOrEqual(upToDate) },
      order: { id: 'ASC' },
    });
    if (schedules.length === 0) {
      return;
    }

    const updates: ScheduleNextDueUpdate[] = [];

    for (const schedule of schedules) {
      const dueDate = new Date(schedule.nextDueDate);
      if (schedule.type === 'EXPENSE') {
        const input: CreateExpenseFromScheduleInput = {
          tenantId: schedule.tenantId,
          categoryId: schedule.categoryId,
          amount: schedule.amount,
          currencyCode: schedule.currencyCode,
          scheduleId: schedule.id,
          description: schedule.description,
          dueDate,
        };
        await this.expensesService.createFromSchedule(input);
      } else {
        const input: CreateIncomeFromScheduleInput = {
          tenantId: schedule.tenantId,
          categoryId: schedule.categoryId,
          amount: schedule.amount,
          currencyCode: schedule.currencyCode,
          scheduleId: schedule.id,
          description: schedule.description,
          dueDate,
        };
        await this.incomeService.createFromSchedule(input);
      }

      const nextDue = addRecurrence(dueDate, schedule.recurrenceInterval, schedule.recurrenceUnit);
      updates.push({ id: schedule.id, nextDueDate: nextDue });
    }

    await this.bulkUpdateNextDueDate(updates);
    await this.notifyTenantsOfOccurrences(schedules);
  }

  private async notifyTenantsOfOccurrences(schedules: Schedule[]): Promise<void> {
    if (schedules.length === 0) {
      return;
    }

    const byTenant = new Map<string, { expenseCount: number; incomeCount: number }>();

    for (const schedule of schedules) {
      const current = byTenant.get(schedule.tenantId) ?? {
        expenseCount: 0,
        incomeCount: 0,
      };
      if (schedule.type === 'EXPENSE') {
        current.expenseCount += 1;
      } else {
        current.incomeCount += 1;
      }

      byTenant.set(schedule.tenantId, current);
    }

    for (const [tenantId, counts] of byTenant) {
      const parts: string[] = [];
      if (counts.expenseCount > 0) {
        parts.push(counts.expenseCount === 1 ? '1 expense' : `${counts.expenseCount} expenses`);
      }

      if (counts.incomeCount > 0) {
        parts.push(counts.incomeCount === 1 ? '1 income' : `${counts.incomeCount} incomes`);
      }

      const message = parts.length > 0 ? `Generated ${parts.join(' and ')} from your schedules.` : null;

      await this.notificationsService.notify({
        tenantId,
        code: SCHEDULE_EXECUTED,
        title: 'Schedules executed',
        message,
      });
    }
  }

  private async bulkUpdateNextDueDate(updates: ScheduleNextDueUpdate[]): Promise<void> {
    if (updates.length === 0) {
      return;
    }

    const params: unknown[] = [];
    const placeholders: string[] = [];
    updates.forEach((u, i) => {
      const base = i * 2 + 1;
      placeholders.push(`($${base}::uuid, $${base + 1}::date)`);
      params.push(u.id, this.formatDate(u.nextDueDate));
    });
    const valuesClause = placeholders.join(', ');
    await this.dataSource.query(
      `UPDATE schedules AS s SET "nextDueDate" = v.d FROM (VALUES ${valuesClause}) AS v(id, d) WHERE s.id = v.id`,
      params,
    );
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
