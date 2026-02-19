import { IsIn, IsString, MaxLength } from 'class-validator';

import { CATEGORY_TYPES } from 'modules/categories';

export class CategoryCreateRequest {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsIn(CATEGORY_TYPES)
  type: (typeof CATEGORY_TYPES)[number];
}
