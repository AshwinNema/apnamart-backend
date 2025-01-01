import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { Checkout2Service } from './checkout2.service';
import { Checkout3Service } from './checkout3.service';
import { PaymentController } from './payment/payment.controller';
import { OrderService } from '../order/order.service';
import { RazorpayPaymentService } from './razorpay-payment/razorpay-payment.service';
import { StripePaymentService } from './stripe-payment/stripe-payment.service';

@Module({
  providers: [
    CheckoutService,
    Checkout2Service,
    Checkout3Service,
    RazorpayPaymentService,
    OrderService,
    StripePaymentService,
  ],
  controllers: [CheckoutController, PaymentController],
})
export class CheckoutModule {}
