import {
  Body,
  Controller,
  Post,
  UsePipes,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Query,
  Delete,
} from '@nestjs/common';
import { Roles } from 'src/auth/role/role.guard';
import { UserRole } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';
import {
  CreateSubCatValidation,
  QuerySubCategories,
  SubcategoryUploadFile,
  SubCategoryValidator,
} from 'src/validations/subcategory.validation';
import { SubcategoryService } from './subcategory.service';
import { SubCategoryInterface } from 'src/interfaces';
import { SkipAccessAuth } from 'src/auth/jwt/access.jwt';
import { MultiPartDataPipe } from 'src/pipes';
import { RequestProcessor } from 'src/decorators';
import {
  getQuerySubCatArgs,
  SubCatCrtDataPipe,
  SubCatDeleteValidator,
  subCategoryCreateProcessor,
  UpdateSubCatValidator,
} from './utils';
import { CommonService } from 'src/common/common.service';
import { SearchByName } from 'src/validations';
@Controller('subcategory')
export class SubcategoryController {
  constructor(
    private subCategoryService: SubcategoryService,
    private commonService: CommonService,
  ) {}
  @Get()
  @SkipAccessAuth()
  getSubCategory(@Query() query: QuerySubCategories) {
    return this.commonService.queryData(...getQuerySubCatArgs(query));
  }

  @Post()
  @Roles(UserRole.admin)
  @UsePipes(new SubCatCrtDataPipe())
  @UsePipes(
    new MultiPartDataPipe(SubCategoryValidator, subCategoryCreateProcessor),
  )
  @FormDataRequest()
  createSubCategory(
    @Body() _: CreateSubCatValidation,
    @RequestProcessor() processedRequest,
  ) {
    const { body } = processedRequest;
    const data = Object(processedRequest.body.data);
    return this.subCategoryService.createSubCategory(data, body.file);
  }

  @Put('image/:id')
  @Roles(UserRole.admin)
  @FormDataRequest()
  updateSubCategoryImage(
    @Body() body: SubcategoryUploadFile,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.subCategoryService.updateSubcategoryImg(id, body.file);
  }

  @Put(':id')
  @UsePipes(new UpdateSubCatValidator())
  @Roles(UserRole.admin)
  updateSubCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SubCategoryInterface,
    @RequestProcessor() _,
  ) {
    return this.subCategoryService.updateSubCategoryById(id, body);
  }

  @Delete(':id')
  @UsePipes(new SubCatDeleteValidator())
  @Roles(UserRole.admin)
  async deleteSubCategory(@Param('id', ParseIntPipe) id: number) {
    await this.subCategoryService.deleteSubCatById(id);
    return { success: true };
  }

  @Get('search-by-name')
  async nameList(@Query() query: SearchByName) {
    return this.subCategoryService.searchByName(query.name);
  }
}
