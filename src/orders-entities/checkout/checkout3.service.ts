import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentMode, Prisma } from '@prisma/client';
import prisma from 'src/prisma/client';
import { InjectRazorpay } from 'nestjs-razorpay';
import Razorpay from 'razorpay';
import { getTotalOrderPrice } from './utils';

@Injectable()
export class Checkout3Service {
  constructor(@InjectRazorpay() private readonly razorpayClient: Razorpay) {}

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
