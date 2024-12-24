import { Injectable } from '@nestjs/common';
import { UserInterface } from 'src/interfaces';
import prisma from 'src/prisma/client';
import {
  CheckoutAddressUpdate,
  CreateCheckoutValidation,
} from 'src/validations';
import {
  getCheckoutCartItems,
  getUserAddress,
  validateCheckoutItems,
  validateUpdateAddress,
} from './utils';
import * as _ from 'lodash';

@Injectable()
export class CheckoutService {
  async createCheckoutSession(
    body: CreateCheckoutValidation,
    user: UserInterface,
  ) {
    const addressDetails = await getUserAddress(user);
    const { checkoutItems, itemDetails } = await (body.items
      ? validateCheckoutItems(body.items)
      : getCheckoutCartItems(user));

    const session = await prisma.checkoutSession.create({
      data: {
        customerId: user.id,
        address: {
          create: addressDetails,
        },
        items: {
          create: checkoutItems,
        },
        itemCount: checkoutItems.length,
      },
      include: {
        address: true,
        items: true,
      },
    });
    const itemList = session.items.map((item, index) => {
      return {
        ...itemDetails[index],
        ...item,
      };
    });
    return {
      ...session,
      items: itemList,
    };
  }

  async updateDeliveryAddress(
    sessionId: number,
    details: CheckoutAddressUpdate,
    user: UserInterface,
  ) {
    await validateUpdateAddress(
      sessionId,
      {
        latitude: details.latitude,
        longtitude: details.longtitude,
      },
      user.id,
    );
    return prisma.checkoutAddress.update({
      where: { sessionId },
      data: details,
    });
  }
}
