import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { ListCategoriesByTypeInput } from '../contracts/list-categories-by-type-input.interface';
import { Category } from '../entities/category.entity';

@Injectable()
export class ListCategoriesByTypeUseCase {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(input: ListCategoriesByTypeInput): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { tenantId: input.tenantId, type: input.type },
      order: { name: 'ASC' },
    });
  }
}
