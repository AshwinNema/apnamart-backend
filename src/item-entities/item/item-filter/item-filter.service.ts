import { Injectable } from '@nestjs/common';
import prisma from 'src/prisma/client';

@Injectable()
export class ItemFilterService {
  async deleteManyFilters(ids: number[]) {
    const promises = ids.map((id) =>
      prisma.itemFilter.update({
        where: { id },
        data: {
          archive: true,
          options: {
            updateMany: {
              where: { archive: false },
              data: { archive: true },
            },
          },
        },
      }),
    );

    return Promise.all(promises);
  }

  async getFiltersByItemId(itemId: number) {
    return prisma.itemFilter.findMany({
      where: { itemId },
      include: {
        options: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
