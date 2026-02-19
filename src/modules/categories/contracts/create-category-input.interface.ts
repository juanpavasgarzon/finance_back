import type { CategoryType } from './category-type.types';

export interface CreateCategoryInput {
  tenantId: string;
  name: string;
  type: CategoryType;
}
