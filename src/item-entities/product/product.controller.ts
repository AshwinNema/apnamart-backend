import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';
import { Roles } from 'src/auth/role/role.guard';
import { RequestProcessor } from 'src/decorators';
import { CreateProductValidation, UpdateProduct } from 'src/validations';
import { ProductService } from './product.service';
import {
  ProductCreateTransformer,
  ProductUpdateTransformer,
} from './transformers';
import { UpdateResourcePipe } from './transformers/update-resource.transformer';
import { DeletePhotoPipe } from './transformers/delete-photo.transformer';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles(UserRole.merchant)
  @UsePipes(new ProductCreateTransformer())
  @FormDataRequest()
  createProduct(
    @Body() body: CreateProductValidation,
    @RequestProcessor() processedBody,
  ) {
    return this.productService.createProduct(body, processedBody);
  }

  @Put('resource/:id')
  @Roles(UserRole.merchant)
  @UsePipes(new UpdateResourcePipe())
  @FormDataRequest()
  updateResource(@RequestProcessor() requestBody) {
    return this.productService.updateResouce(
      requestBody.data,
      requestBody.file,
    );
  }

  @Put(':id')
  @Roles(UserRole.merchant)
  @UsePipes(new ProductUpdateTransformer())
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() _: UpdateProduct,
    @RequestProcessor() processedBody,
  ) {
    return this.productService.updateProductById({ id }, processedBody);
  }

  @Delete('photo-resource/:id')
  @Roles(UserRole.merchant)
  @UsePipes(new DeletePhotoPipe())
  deleteResource(
    @Param('id', ParseIntPipe) _,
    @RequestProcessor() requestBody,
  ) {
    return this.productService.deletePhoto(requestBody);
  }
}
