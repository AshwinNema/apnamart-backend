import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from 'src/prisma/client';
import { getTotalOrderPrice } from '../checkout/utils';
import * as _ from 'lodash';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  async createOrder(
    sessionId: number,
    details: { razorpayPaymentId?: string; paymentStatus?: PaymentStatus },
  ) {
    const sessionDetails = await prisma.checkoutSession.findUnique({
      where: { id: sessionId, hasSessionEnded: false },
      include: { address: true, items: true },
    });

    if (!sessionDetails) {
      return { msg: 'Session not found' };
    }
    const { customerId, items, paymentMode, address, razorPayOrderId } =
      sessionDetails;
    const addressDetails = _.pick(address, [
      'addressLine1',
      'addressLine2',
      'latitude',
      'longtitude',
      'addressType',
      'otherAddress',
    ]);
    const promises = [
      prisma.checkoutSession.update({
        where: { id: sessionId },
        data: {
          hasSessionEnded: true,
        },
      }),
      prisma.order.create({
        data: {
          customerId,
          totalOrderAmount: getTotalOrderPrice(items),
          paymentMode,
          address: {
            create: addressDetails,
          },
          orderItems: {
            create: items.map((item) => {
              const { name, quantity, price, productId } = item;
              return { name, quantity, price, productId };
            }),
          },
          razorPayOrderId,
          ...details,
        },
      }),
    ];
    const fullFilledPromises = await Promise.allSettled(promises);
    const order = fullFilledPromises[1];
    if (order.status === 'fulfilled') return order.value;
    throw new BadRequestException(order.reason);
  }
}
