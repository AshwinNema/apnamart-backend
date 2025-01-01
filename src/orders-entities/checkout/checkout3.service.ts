import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentMode, Prisma } from '@prisma/client';
import prisma from 'src/prisma/client';
import { InjectRazorpay } from 'nestjs-razorpay';
import Razorpay from 'razorpay';
import { getTotalOrderPrice } from './utils';
import { StripePaymentService } from './stripe-payment/stripe-payment.service';

@Injectable()
export class Checkout3Service {
  stripeClient;
  constructor(
    @InjectRazorpay() private readonly razorpayClient: Razorpay,
    private stripeService: StripePaymentService,
  ) {}

  async changePaymentMode(
    sessionId: number,
    customerId: number,
    paymentMode: PaymentMode,
  ) {
    const session = await prisma.checkoutSession.findUnique({
      where: {
        id: sessionId,
        customerId,
        hasSessionEnded: false,
      },
    });
    if (!session) throw new BadRequestException('Session not found');
    const update: Prisma.CheckoutSessionUpdateInput = {
      paymentMode,
    };

    const checkoutItems = await prisma.checkoutItem.findMany({
      where: {
        sessionId: sessionId,
      },
    });

    const totalPrice = getTotalOrderPrice(checkoutItems);

    switch (paymentMode) {
      case PaymentMode.razorpay:
        {
          const order = await this.razorpayClient.orders.create({
            amount: totalPrice * 100,
            currency: 'INR',
            notes: {
              sessionId: sessionId,
            },
          });
          update.razorPayOrderId = order.id;
        }
        break;

      case PaymentMode.stripe:
        {
          if (!session.stripeClientSecret) {
            const paymentIntent = await this.stripeService.createPaymentIntent(
              totalPrice,
              sessionId,
            );
            update.stripeClientSecret = paymentIntent.client_secret;
          }
        }
        break;
      default:
        break;
    }
    const updatedSession = await prisma.checkoutSession.update({
      where: { id: sessionId },
      data: update,
    });
    return { ...updatedSession, totalPrice };
  }
}
