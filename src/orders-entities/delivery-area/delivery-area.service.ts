import { Injectable } from '@nestjs/common';
import { UserInterface } from 'src/interfaces';
import prisma from 'src/prisma/client';
import { isWithinRange } from 'src/utils/delivery-area';
import { UpdateMapState } from 'src/validations';

@Injectable()
export class DeliveryAreaService {
  async updateDeliveryAreas(updatedState: UpdateMapState, user: UserInterface) {
    const { created, update, deleted } = updatedState;
    const promises = [];
    if (created.length) {
      const createdAreas = created.map((newArea) => {
        return { ...newArea, createdBy: user.id };
      });
      promises.push(
        prisma.deliveryArea.createMany({
          data: createdAreas,
        }),
      );
    }

    if (update.length) {
      const updatePromises = update.map((updatedArea) => {
        const { id } = updatedArea;
        delete updatedArea.id;

        return prisma.deliveryArea.update({
          where: { id: id },
          data: updatedArea,
        });
      });
      promises.push(...updatePromises);
    }

    if (deleted.length) {
      promises.push(
        prisma.deliveryArea.updateMany({
          where: { id: { in: deleted } },
          data: {
            archive: true,
          },
        }),
      );
    }

    await Promise.all(promises);
    return { success: true };
  }

  async findAllDeliveryAreas() {
    return prisma.deliveryArea.findMany({ where: {} });
  }

  async checkIsAreaDeliverable(details: {
    latitude: number;
    longtitude: number;
  }) {
    const deliveryAreas = await this.findAllDeliveryAreas();

    return deliveryAreas.some((deliveryArea) =>
      isWithinRange(
        Number(deliveryArea.latitude),
        Number(deliveryArea.longtitude),
        details.latitude,
        details.longtitude,
        Number(deliveryArea.radius),
      ),
    );
  }
}
