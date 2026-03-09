export interface CreateExpenseFromScheduleInput {
  tenantId: string;
  categoryId: string;
  name: string;
  amount: string;
  scheduleId: string;
  description: string | null;
  dueDate: Date;
}
