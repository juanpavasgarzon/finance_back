export interface NotifyInput {
  tenantId: string;
  code: string;
  title: string;
  message?: string | null;
  emitRealtime?: boolean;
}
