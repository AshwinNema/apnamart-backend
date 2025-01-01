import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import prisma from 'src/prisma/client';
import { IncreaseDecreaseCartItem } from 'src/validations';

@Injectable()
export class Checkout2Service {
  async changeItemQuantity(
    itemId: number,
    changeDetails: IncreaseDecreaseCartItem,
    customerId: number,
  ) {
    const itemDetails = await prisma.checkoutItem.findUnique({
      where: {
        id: itemId,
        session: {
          customerId,
          hasSessionEnded: false,
        },
      },
      include: {
        product: true,
      },
    });
    if (!itemDetails) {
      throw new BadRequestException('Item not found');
    }
    const { product } = itemDetails;
    const { allowedUnitsPerOrder, name } = product;
    const updatedQuantity = changeDetails.quantity
      ? changeDetails.quantity
      : itemDetails.quantity + changeDetails.change;
    if (!updatedQuantity) {
      throw new BadRequestException('Updated quantity cannot be less than 1');
    }
    if (updatedQuantity > allowedUnitsPerOrder) {
      throw new BadRequestException(
        `You cannot order more than ${allowedUnitsPerOrder} of ${name}`,
      );
    }

    return prisma.checkoutItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity: updatedQuantity,
      },
    });
  }

  async removeCheckoutItem(itemId: number, customerId: number) {
    const itemDetails = await prisma.checkoutItem.findUnique({
      where: {
        id: itemId,
        session: {
          customerId,
          hasSessionEnded: false,
        },
      },
    });

    if (!itemDetails) {
      throw new NotFoundException('Checkout Item not found');
    }

    return prisma.checkoutItem.delete({
      where: { id: itemId },
    });
  }
}
