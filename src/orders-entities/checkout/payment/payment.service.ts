import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderService } from 'src/orders-entities/order/order.service';
import prisma from 'src/prisma/client';
import { RazorPayPaymentValidation } from 'src/validations/checkout-validation/payment.validation';

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,
    private orderService: OrderService,
  ) {}
  async verifyRazorpaySignature(
    details: RazorPayPaymentValidation,
    sessionId: number,
    customerId: number,
  ) {
    const sessionDetails = await prisma.checkoutSession.findUnique({
      where: { id: sessionId, customerId, hasSessionEnded: false },
    });
    if (!sessionDetails) {
      throw new BadRequestException('Session not found');
    }
    const { createHmac } = await import('node:crypto');
    const { key_secret } = this.configService.get('razorPay');
    const generatedSignature = createHmac('sha256', key_secret)
      .update(
        sessionDetails.razorpayPaymentId + '|' + details.razorpay_payment_id,
      )
      .digest('hex');

    if (generatedSignature !== details.razorpay_signature) {
      throw new BadRequestException('Signature did not match');
    }

    return this.orderService.createOrder(sessionId, {
      razorpayPaymentId: details.razorpay_payment_id,
    });
  }
}
