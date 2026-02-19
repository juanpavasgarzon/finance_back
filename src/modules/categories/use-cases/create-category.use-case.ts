import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateCategoryInput } from '../contracts/create-category-input.interface';
import { Category } from '../entities/category.entity';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(input: CreateCategoryInput): Promise<Category> {
    const category = this.categoryRepository.create({
      tenantId: input.tenantId,
      name: input.name,
      type: input.type,
    });
    return this.categoryRepository.save(category);
  }
}
