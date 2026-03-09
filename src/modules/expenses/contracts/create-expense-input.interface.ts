export interface CreateExpenseInput {
  tenantId: string;
  categoryId: string;
  name: string;
  amount: string;
  description?: string;
  dueDate?: Date;
  scheduleId?: string;
  paidAt?: Date | null;
}
