import { Controller, Get, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { SubcategoryService } from './subcategory.service';
import { Roles } from 'src/auth/role/role.guard';
import { SubCatListValidator } from 'src/validations';

@Controller('subcategory')
export class Subcategory2Controller {
  constructor(private subCategoryService: SubcategoryService) {}

  @Get('list')
  @Roles(UserRole.admin)
  async subCatList(@Query() query: SubCatListValidator) {
    return this.subCategoryService.getSubCatList(query);
  }
}
