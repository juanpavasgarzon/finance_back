import type { CategoryBreakdownItemParams } from '../../contracts/category-breakdown-item-params.interface';

export class CategoryBreakdownItemResponse {
  categoryId: string;
  categoryName: string;
  total: number;
  currencyCode: string;
  count: number;

  constructor(params: CategoryBreakdownItemParams) {
    this.categoryId = params.categoryId;
    this.categoryName = params.categoryName;
    this.total = params.total;
    this.currencyCode = params.currencyCode;
    this.count = params.count;
  }
}
