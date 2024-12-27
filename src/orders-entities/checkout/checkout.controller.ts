import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { User } from 'src/decorators';
import {
  CheckoutAddressUpdate,
  CreateCheckoutValidation,
  IncreaseDecreaseCartItem,
  ChangePaymentMode,
} from 'src/validations';
import { CheckoutService } from './checkout.service';
import { Roles } from 'src/auth/role/role.guard';
import { UserRole } from '@prisma/client';
import { Checkout2Service } from './checkout2.service';
import { UserInterface } from 'src/interfaces';
import { Checkout3Service } from './checkout3.service';

@Controller()
export class CheckoutController {
  constructor(
    private checkoutService: CheckoutService,
    private checkoutService2: Checkout2Service,
    private checkoutService3: Checkout3Service,
  ) {}

  @Roles(UserRole.customer)
  @Post()
  createCheckoutSession(@Body() body: CreateCheckoutValidation, @User() user) {
    return this.checkoutService.createCheckoutSession(body, user);
  }

  @Roles(UserRole.customer)
  @Put('address/:sessionId')
  updateDeliveryAddress(
    @Body() details: CheckoutAddressUpdate,
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @User() user,
  ) {
    return this.checkoutService.updateDeliveryAddress(sessionId, details, user);
  }

  @Roles(UserRole.customer)
  @Put('end/:sessionId')
  endCheckoutSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @User() user: UserInterface,
  ) {
    return this.checkoutService2.endCheckoutSession(sessionId, user.id);
  }

  @Roles(UserRole.customer)
  @Put('quantity-change/:itemId')
  changeItemQuantity(
    @Param('itemId', ParseIntPipe) itemId: number,
    @User() user,
    @Body() body: IncreaseDecreaseCartItem,
  ) {
    return this.checkoutService2.changeItemQuantity(itemId, body, user.id);
  }

  @Roles(UserRole.customer)
  @Delete('delete-item/:itemId')
  removeCheckoutItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @User() user,
  ) {
    return this.checkoutService2.removeCheckoutItem(itemId, user.id);
  }

  @Roles(UserRole.customer)
  @Put('change-paymentMode/:sessionId')
  changePaymentMode(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() { paymentMode }: ChangePaymentMode,
    @User() user,
  ) {
    return this.checkoutService3.changePaymentMode(
      sessionId,
      user.id,
      paymentMode,
    );
  }
}
