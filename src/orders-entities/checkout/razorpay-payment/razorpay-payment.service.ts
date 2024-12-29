import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';
import { OrderService } from 'src/orders-entities/order/order.service';
import { RazorPayPaymentValidation } from 'src/validations/checkout-validation/payment.validation';

@Injectable()
export class RazorpayPaymentService {
  razorPayDetails: {
    key_id: string;
    key_secret: string;
    webhook_secret: string;
  };

  constructor(
    private configService: ConfigService,
    private orderService: OrderService,
  ) {
    this.razorPayDetails = this.configService.get('razorPay');
  }
  async verifyRazorpaySignature(details: RazorPayPaymentValidation) {
    const { createHmac } = await import('node:crypto');
    const { key_secret } = this.razorPayDetails;
    const generatedSignature = createHmac('sha256', key_secret)
      .update(details.razorpay_order_id + '|' + details.razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== details.razorpay_signature) {
      throw new BadRequestException('Signature did not match');
    }
    return { success: true };
  }

  async validateRazorpayPayment(signature, body) {
    const {
      validateWebhookSignature,
    } = require('razorpay/dist/utils/razorpay-utils');

    if (
      !validateWebhookSignature(
        JSON.stringify(body),
        signature,
        this.razorPayDetails.webhook_secret,
      )
    ) {
      throw new BadRequestException('Webhook validation failed');
    }

    if (body.event !== 'payment.captured') return;
    const entityDetails = body.payload.payment.entity;
    const paymentId = entityDetails.id;

    return this.orderService.createOrder(entityDetails.notes.sessionId, {
      razorpayPaymentId: paymentId,
      paymentStatus: PaymentStatus.confirmed,
    });
  }
}
