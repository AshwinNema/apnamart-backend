import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';
import { OrderService } from 'src/orders-entities/order/order.service';

@Injectable()
export class StripePaymentService {
  stripeClient;
  webhookSecret: string;
  constructor(
    private configService: ConfigService,
    private orderService: OrderService,
  ) {
    const { api_key, webhook_secret } = this.configService.get('stripe');
    this.stripeClient = require('stripe')(api_key);
    this.webhookSecret = webhook_secret;
  }
  async createPaymentIntent(totalPrice: number, sessionId: number) {
    return this.stripeClient.paymentIntents.create({
      amount: totalPrice,
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        sessionId,
      },
    });
  }

  async verifyWebhookSignature(request) {
    const signature = request.headers['stripe-signature'];
    const event = this.stripeClient.webhooks.constructEvent(
      request.rawBody,
      signature,
      this.webhookSecret,
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        this.orderService.createOrder(
          parseInt(event.data.object.metadata.sessionId),
          {
            paymentStatus: PaymentStatus.confirmed,
          },
        );
        break;
      default:
        break;
    }
  }
}
