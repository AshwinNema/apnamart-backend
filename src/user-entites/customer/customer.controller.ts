import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SkipAccessAuth } from 'src/auth/jwt/access.jwt';
import { AddRemoveWishlistItem, booleanEnum } from 'src/validations';
import { Roles } from 'src/auth/role/role.guard';
import { UserRole } from '@prisma/client';
import { User } from 'src/decorators';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @SkipAccessAuth()
  @Get('category-subcategory-item-menu')
  async getCategorySubCategoryItemFilter() {
    return this.customerService.getCategorySubCategoryItemMenu();
  }

  @Roles(UserRole.customer)
  @Put('add-remove-wishlist-item/:productId')
  async addRemoveItemFromWishlist(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() query: AddRemoveWishlistItem,
    @User() user,
  ) {
    return this.customerService.addRemoveItemInUserWishlist(
      user.id,
      productId,
      query.connect === booleanEnum.true,
    );
  }
}
