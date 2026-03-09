export interface EffectiveDateRow {
  name: string;
  amount: string;
  categoryName: string;
  description: string | null;
  paidAt: Date | null;
  dueDate: Date | null;
  createdAt: Date;
}
