import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CategoryController } from 'src/item-entities/category/category.controller';
import { UploaderModule } from 'src/uploader/uploader.module';
import { CategoryService } from './category/category.service';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { CommonService } from 'src/common/common.service';
import { ItemModule } from './item/item.module';
import { RouterModule } from '@nestjs/core';
import { ProductUpdateService } from './product/product-update/product-update.service';
import { SubcategoryController } from './subcategory/subcategory.controller';
import { Subcategory2Controller } from './subcategory/subcategory2.controller';
import { SubcategoryService } from './subcategory/subcategory.service';
import { Product2Service } from './product/product2.service';

@Module({
  imports: [
    NestjsFormDataModule,
    UploaderModule,
    ItemModule,
    RouterModule.register([
      {
        path: 'item',
        module: ItemModule,
      },
    ]),
  ],
  providers: [
    CategoryService,
    ProductService,
    SubcategoryService,
    CommonService,
    ProductUpdateService,
    Product2Service,
  ],
  controllers: [
    CategoryController,
    SubcategoryController,
    Subcategory2Controller,
    ProductController,
  ],
})
export class ItemEntitiesModule {}
