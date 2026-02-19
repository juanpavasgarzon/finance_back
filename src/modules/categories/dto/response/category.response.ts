import { Category } from '../../entities/category.entity';

export class CategoryResponse {
  id: string;
  name: string;
  type: string;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.type = category.type;
  }
}
