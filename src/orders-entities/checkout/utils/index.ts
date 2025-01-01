import { BadRequestException } from '@nestjs/common';
import { UserInterface } from 'src/interfaces';
import { DeliveryAreaService } from 'src/orders-entities/delivery-area/delivery-area.service';
import prisma from 'src/prisma/client';
import { LatLng } from 'src/validations';
import * as _ from 'lodash';
import { PaymentMode } from '@prisma/client';

export * from './create-checkout';

export const validateUpdateAddress = async (
  sessionId: number,
  latLng: LatLng,
  customerId: number,
) => {
  const data = await prisma.checkoutAddress.findUnique({
    where: {
      sessionId,
      session: {
        customerId,
        hasSessionEnded: false,
      },
    },
  });
  if (!data) {
    throw new BadRequestException('Session not found');
  }

  const deliveryAreaService = new DeliveryAreaService();

  if (!(await deliveryAreaService.checkIsAreaDeliverable(latLng))) {
    throw new BadRequestException('Area is not deliverable');
  }
};

export const getUserAddress = async (user: UserInterface) => {
  const address = await prisma.userAddress.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!address) {
    throw new BadRequestException(
      'Please save your address details before proceeding',
    );
  }
  const addressDetails = _.pick(address, [
    'longtitude',
    'latitude',
    'addressType',
    'addressLine1',
    'addressLine2',
    'otherAddress',
  ]);
  return addressDetails;
};

export const validateAndGetOrderSession = async (
  transaction,
  sessionId,
  additionalSessionFilter,
  isCashOrder,
) => {
  const sessionDetails = await transaction.checkoutSession.findUnique({
    where: {
      id: sessionId,
      hasSessionEnded: false,
      ...additionalSessionFilter,
    },
    include: { address: true, items: true },
  });

  if (!sessionDetails) {
    return { msg: 'Session not found' };
  }
  if (isCashOrder && sessionDetails.paymentMode !== PaymentMode.cash) {
    throw new BadRequestException('Order is not a cash order');
  }

  const { items } = sessionDetails;

  if (!items.length) {
    throw new BadRequestException('There are no items in the order');
  }

  return sessionDetails;
};

export const getTotalOrderPrice = <
  T extends { quantity: number; price: number },
>(
  checkoutItems: T[],
) => {
  return checkoutItems.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0,
  );
};
