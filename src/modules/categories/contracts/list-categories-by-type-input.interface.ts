import type { CategoryType } from './category-type.types';

export interface ListCategoriesByTypeInput {
  tenantId: string;
  type: CategoryType;
}
