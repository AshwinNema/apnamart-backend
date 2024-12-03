import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ItemFilterService } from './item-filter.service';
import { SkipAccessAuth } from 'src/auth/jwt/access.jwt';

@Controller('item-filter')
export class ItemFilterController {
  constructor(private itemFilterService: ItemFilterService) {}

  @SkipAccessAuth()
  @Get('by-item-id/:id')
  getFiltersById(@Param('id', ParseIntPipe) id: number) {
    return this.itemFilterService.getFiltersByItemId(id);
  }
}
