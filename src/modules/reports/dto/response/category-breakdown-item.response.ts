import type { CategoryBreakdownItemParams } from '../../contracts/category-breakdown-item-params.interface';

export class CategoryBreakdownItemResponse {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;

  constructor(params: CategoryBreakdownItemParams) {
    this.categoryId = params.categoryId;
    this.categoryName = params.categoryName;
    this.total = params.total;
    this.count = params.count;
  }
}
