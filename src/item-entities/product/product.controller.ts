import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';
import { Roles } from 'src/auth/role/role.guard';
import { RequestProcessor, User } from 'src/decorators';
import {
  CreateProductValidation,
  QueryProducts,
  QueryCustomerProducts,
  UpdateProductValidation,
} from 'src/validations';
import { ProductService } from './product.service';
import { CreateProductTransformer } from './utils/transformers';
import { UserInterface } from 'src/interfaces';
import { CommonService } from 'src/common/common.service';
import { queryProductArgs } from './utils';
import { UpdateProductTransformer } from './utils/transformers/update';
import { ProductUpdateService } from './product-update/product-update.service';
import { processedUpdateProduct } from './interfaces';
import { SkipAccessAuth } from 'src/auth/jwt/access.jwt';
import { Product2Service } from './product2.service';

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private productUpdateService: ProductUpdateService,
    private commonService: CommonService,
    private product2Service: Product2Service,
  ) {}

  @Roles(UserRole.merchant)
  @Get('by-merchant')
  queryProducts(@Query() query: QueryProducts, @User() user: UserInterface) {
    return this.commonService.queryData(...queryProductArgs(query, user));
  }

  @Post()
  @Roles(UserRole.merchant)
  @UsePipes(new CreateProductTransformer())
  @FormDataRequest()
  createProduct(
    @Body() body: CreateProductValidation,
    @RequestProcessor() processedBody,
  ) {
    return this.productService.createProduct(body, processedBody);
  }

  @Put(':id')
  @Roles(UserRole.merchant)
  @UsePipes(new UpdateProductTransformer())
  @FormDataRequest()
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductValidation,
    @RequestProcessor() processedBody: processedUpdateProduct,
  ) {
    return this.productUpdateService.updateProduct(id, body, processedBody);
  }

  @Get('selected-filters/:id')
  @Roles(UserRole.merchant, UserRole.merchant)
  async getProductFilters(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductFilters(id);
  }

  @SkipAccessAuth()
  @Get('by-customer')
  queryCustomerProducts(@Query() query: QueryCustomerProducts) {
    return this.product2Service.queryCustomerProducts(query);
  }
}
