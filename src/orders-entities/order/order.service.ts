import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from 'src/prisma/client';
import {
  getTotalOrderPrice,
  validateAndGetOrderSession,
} from '../checkout/utils';
import * as _ from 'lodash';
import { PaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  async createOrder(
    sessionId: number,
    details: { razorpayPaymentId?: string; paymentStatus?: PaymentStatus },
    additionalSessionFilter?: any,
    isCashOrder?: boolean,
  ) {
    const order = await prisma.$transaction(
      async (transaction) => {
        const sessionDetails = await validateAndGetOrderSession(
          transaction,
          sessionId,
          additionalSessionFilter,
          isCashOrder,
        );

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
        const promises: Promise<any>[] = [
          transaction.order.create({
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
          transaction.checkoutSession.delete({
            where: { id: sessionId },
          }),
        ];

        const userCart = await transaction.cart.findUnique({
          where: { userId: customerId },
        });
        if (userCart) {
          const cartItems = userCart.cartItems;
          items.forEach((item) => {
            const productId = item.productId;
            if (cartItems[productId]) {
              cartItems[productId] = Math.max(
                0,
                cartItems[productId] - item.quantity,
              );
              if (!cartItems[productId]) {
                delete cartItems[productId];
              }
            }
          });

          promises.push(
            transaction.cart.update({
              where: { userId: customerId },
              data: { cartItems },
            }),
          );
        }
        const settledPromises = await Promise.allSettled(promises);
        const rejectedPromise = settledPromises.find(
          (promise) => promise.status === 'rejected',
        );
        if (rejectedPromise) {
          throw new BadRequestException(rejectedPromise.reason);
        }
        if (settledPromises[0].status === 'fulfilled') {
          return settledPromises[0].value;
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
    return order;
  }
}
