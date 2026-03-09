import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdatePreferencesRequest {
  @IsOptional()
  @IsString()
  @IsIn(['light', 'dark'])
  theme?: 'light' | 'dark';

  @IsOptional()
  @IsBoolean()
  sidebarCollapsed?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['en', 'es'])
  locale?: 'en' | 'es';
}
