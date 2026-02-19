import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from './controllers/category.controller';
import { Category } from './entities/category.entity';
import { CreateCategoryUseCase } from './use-cases/create-category.use-case';
import { ListCategoriesByTypeUseCase } from './use-cases/list-categories-by-type.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CreateCategoryUseCase, ListCategoriesByTypeUseCase],
  exports: [TypeOrmModule],
})
export class CategoriesModule {}
