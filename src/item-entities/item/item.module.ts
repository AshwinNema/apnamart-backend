import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { UploaderModule } from 'src/uploader/uploader.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ItemFilterService } from './item-filter/item-filter.service';
import { ItemController } from './item.controller';
import { CommonService } from 'src/common/common.service';
import { ItemFilterController } from './item-filter/item-filter.controller';
import { Item2Controller } from './item2.controller';

@Module({
  imports: [UploaderModule, NestjsFormDataModule],
  controllers: [ItemController, ItemFilterController, Item2Controller],
  providers: [ItemService, ItemFilterService, CommonService],
  exports: [ItemService],
})
export class ItemModule {}
