export interface CreateNotificationInput {
  tenantId: string;
  code: string;
  title: string;
  message?: string | null;
}
