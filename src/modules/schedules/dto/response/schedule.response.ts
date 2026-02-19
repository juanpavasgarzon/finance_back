import { Schedule } from '../../entities/schedule.entity';

export class ScheduleResponse {
  id: string;
  categoryId: string;
  type: string;
  amount: string;
  currencyCode: string;
  recurrenceInterval: number;
  recurrenceUnit: string;
  nextDueDate: string;
  description: string | null;
  createdAt: string;

  constructor(schedule: Schedule) {
    this.id = schedule.id;
    this.categoryId = schedule.categoryId;
    this.type = schedule.type;
    this.amount = schedule.amount;
    this.currencyCode = schedule.currencyCode;
    this.recurrenceInterval = schedule.recurrenceInterval;
    this.recurrenceUnit = schedule.recurrenceUnit;
    this.nextDueDate = new Date(schedule.nextDueDate).toISOString().slice(0, 10);
    this.description = schedule.description;
    this.createdAt = schedule.createdAt.toISOString();
  }
}
