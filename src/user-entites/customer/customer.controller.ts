import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SkipAccessAuth } from 'src/auth/jwt/access.jwt';
import {
  AddRemoveCartItem,
  AddRemoveWishlistItem,
  booleanEnum,
  IncreaseDecreaseCartItem,
  paginationOptions,
} from 'src/validations';
import { Roles } from 'src/auth/role/role.guard';
import { UserRole } from '@prisma/client';
import { User } from 'src/decorators';
import { CustomerCartService } from './customer-cart.service';
import { CustomerOrderService } from './customer-order/customer-order.service';

@Controller('customer')
export class CustomerController {
  constructor(
    private customerService: CustomerService,
    private customerCartService: CustomerCartService,
    private customerOrderService: CustomerOrderService,
  ) {}

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

  @Roles(UserRole.customer)
  @Put('add-remove-cart-item/:productId')
  addRemoveCartItem(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() query: AddRemoveCartItem,
    @User() user,
  ) {
    return this.customerCartService.addRemoveCartItem(
      user.id,
      productId,
      query.connect === booleanEnum.true,
    );
  }

  @Roles(UserRole.customer)
  @Get('cart-item-count')
  getCartItemCount(@User() user) {
    return this.customerCartService.getUserCartCount(user.id);
  }

  @Roles(UserRole.customer)
  @Get('cart-item-list')
  customerCartItemList(@User() user) {
    return this.customerCartService.getUserCartItems(user.id);
  }

  @Roles(UserRole.customer)
  @Put('increase-decrease-cart-item-count/:itemId')
  increaseDecreaseCartItemCount(
    @Param('itemId', ParseIntPipe) itemId: number,
    @User() user,
    @Body() body: IncreaseDecreaseCartItem,
  ) {
    return this.customerCartService.increaseDecreaseItemCount(
      user.id,
      itemId,
      body.change,
      body.quantity,
    );
  }

  @Roles(UserRole.customer)
  @Get('orders')
  queryOrders(@User() user, @Query() query: paginationOptions) {
    return this.customerOrderService.queryCustomerOrders(user.id, query);
  }
}
