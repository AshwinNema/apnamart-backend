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
  providers: [CategoryService, ProductService, CommonService],
  controllers: [CategoryController, ProductController],
})
export class ItemEntitiesModule {}
