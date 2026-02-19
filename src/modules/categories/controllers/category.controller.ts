import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import type { CategoryType } from 'modules/categories';

import { CurrentTenantId } from 'shared';

import { CategoryCreateRequest } from '../dto/request/category-create.request';
import { CategoryResponse } from '../dto/response/category.response';
import { CreateCategoryUseCase } from '../use-cases/create-category.use-case';
import { ListCategoriesByTypeUseCase } from '../use-cases/list-categories-by-type.use-case';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesByTypeUseCase: ListCategoriesByTypeUseCase,
  ) {}

  @Post()
  async create(@CurrentTenantId() tenantId: string, @Body() request: CategoryCreateRequest): Promise<CategoryResponse> {
    const category = await this.createCategoryUseCase.execute({
      tenantId,
      name: request.name,
      type: request.type,
    });
    return new CategoryResponse(category);
  }

  @Get()
  async listByType(@CurrentTenantId() tenantId: string, @Query('type') type: CategoryType): Promise<CategoryResponse[]> {
    const categories = await this.listCategoriesByTypeUseCase.execute({
      tenantId,
      type,
    });
    return categories.map((category) => new CategoryResponse(category));
  }
}
