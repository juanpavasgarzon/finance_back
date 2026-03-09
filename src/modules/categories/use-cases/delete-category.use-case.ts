import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Category } from '../entities/category.entity';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(tenantId: string, categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, tenantId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    try {
      await this.categoryRepository.delete({ id: categoryId, tenantId });
    } catch (error: unknown) {
      if (error instanceof QueryFailedError && (error as QueryFailedError & { code: string }).code === '23503') {
        throw new ConflictException('Category has related records and cannot be deleted');
      }

      throw error;
    }
  }
}
