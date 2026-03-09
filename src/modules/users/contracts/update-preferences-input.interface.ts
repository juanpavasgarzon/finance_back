export interface UpdatePreferencesInput {
  tenantId: string;
  theme?: 'light' | 'dark';
  sidebarCollapsed?: boolean;
  locale?: 'en' | 'es';
}
