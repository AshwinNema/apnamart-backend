import { Controller, Get, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import { getItemListValidation } from 'src/validations';

@Controller()
export class Item2Controller {
  constructor(private itemService: ItemService) {}

  @Get('list')
  getItemsList(@Query() query: getItemListValidation) {
    return this.itemService.getItemsList(query);
  }
}
