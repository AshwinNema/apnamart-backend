import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/prisma/client';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/utils/types';
import { ItemFilterService } from './item-filter/item-filter.service';

@Injectable()
export class ItemService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private itemFilterService: ItemFilterService,
  ) {}

  async getOneItem(where, otherOptions?: object) {
    return prisma.item.findFirst({ where, ...otherOptions });
  }

  async createItem(
    body: Prisma.ItemUncheckedCreateInput,
    file: Express.Multer.File,
  ) {
    const uploadedFile: CloudinaryResponse =
      await this.cloudinaryService.uploadFile(file);
    return prisma.item.create({
      data: {
        ...body,
        photo: uploadedFile.secure_url,
        cloudinary_public_id: uploadedFile.public_id,
      },
    });
  }

  async updateItemImg(id: number, file: Express.Multer.File) {
    await this.cloudinaryService.deletePrismaEntityFile('item', id);
    return this.cloudinaryService.updatePrismaEntityFile('item', id, file);
  }

  async updateItemById(
    id: number,
    {
      update,
      deleteFilters,
    }: {
      update: Prisma.ItemUpdateArgs;
      deleteFilters?: number[];
    },
  ) {
    if (deleteFilters?.length) {
      await this.itemFilterService.deleteManyFilters(deleteFilters);
    }
    return prisma.item.update(update);
  }
  async deleteItem(id: number) {
    const deletedItem = await prisma.item.update({
      where: { id },
      data: { archive: true },
      include: {
        filters: {
          select: { id: true },
        },
      },
    });

    if (deletedItem) {
      const filterIds = deletedItem.filters.map(({ id }) => id);
      await this.itemFilterService.deleteManyFilters(filterIds);
    }

    return;
  }

  async searchByName(term: string) {
    return prisma.$queryRaw`SELECT "id", "name", "photo" FROM "public"."Item" WHERE ("archive"=false AND to_tsvector('english', "public"."Item"."name") @@ to_tsquery('english', ${term}));`;
  }
}
