import { BadRequestException } from '@nestjs/common';
import { UserInterface } from 'src/interfaces';
import { DeliveryAreaService } from 'src/orders-entities/delivery-area/delivery-area.service';
import prisma from 'src/prisma/client';
import { LatLng } from 'src/validations';
import * as _ from "lodash"

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