import { Schedule } from '../../entities/schedule.entity';

export class ScheduleResponse {
  id: string;
  categoryId: string;
  type: string;
  name: string;
  amount: string;
  recurrenceInterval: number;
  recurrenceUnit: string;
  nextDueDate: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  createdAt: string;

  constructor(schedule: Schedule) {
    this.id = schedule.id;
    this.categoryId = schedule.categoryId;
    this.type = schedule.type;
    this.name = schedule.name ?? '';
    this.amount = schedule.amount;
    this.recurrenceInterval = schedule.recurrenceInterval;
    this.recurrenceUnit = schedule.recurrenceUnit;
    this.nextDueDate = new Date(schedule.nextDueDate).toISOString().slice(0, 10);
    this.startDate = new Date(schedule.startDate).toISOString().slice(0, 10);
    this.endDate = schedule.endDate ? new Date(schedule.endDate).toISOString().slice(0, 10) : null;
    this.description = schedule.description;
    this.createdAt = schedule.createdAt.toISOString();
  }
}
