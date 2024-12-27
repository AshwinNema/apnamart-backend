import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { Checkout2Service } from './checkout2.service';
import { Checkout3Service } from './checkout3.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { OrderService } from '../order/order.service';

@Module({
  providers: [
    CheckoutService,
    Checkout2Service,
    Checkout3Service,
    PaymentService,
    OrderService,
  ],
  controllers: [CheckoutController, PaymentController],
})
export class CheckoutModule {}
