import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/prisma/client';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/utils/types';
import { ItemFilterService } from './item-filter/item-filter.service';
import { getItemListValidation } from 'src/validations';

@Injectable()
export class ItemService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private itemFilterService: ItemFilterService,
  ) {}

  async getOneItem(where: Prisma.ItemWhereInput, otherOptions?: object) {
    return prisma.item.findFirst({ where, ...otherOptions });
  }

  async createItem(
    body: Prisma.ItemUncheckedCreateInput,
    file?: Express.Multer.File,
  ) {
    const fileDetails: { photo?: string; cloudinary_public_id?: string } = {};
    if (file) {
      const uploadedFile: CloudinaryResponse =
        await this.cloudinaryService.uploadFile(file);
      fileDetails.photo = uploadedFile.secure_url;
      fileDetails.cloudinary_public_id = uploadedFile.public_id;
    }

    return prisma.item.create({
      data: {
        ...body,
        ...fileDetails,
      },
    });
  }

  async updateItemImg(id: number, file: Express.Multer.File) {
    await this.cloudinaryService.deletePrismaEntityFile('item', id);
    return this.cloudinaryService.updatePrismaEntityFile('item', id, file);
  }

  async updateItemById({
    update,
    deleteFilters,
  }: {
    update: Prisma.ItemUpdateArgs;
    deleteFilters?: number[];
  }) {
    if (deleteFilters?.length) {
      await this.itemFilterService.deleteManyFilters(deleteFilters);
    }
    return prisma.item.update(update);
  }
  async deleteItem(id: number) {
    const productAttached = await prisma.product.findFirst({
      where: {
        itemId: id,
      },
    });

    if (productAttached)
      throw new BadRequestException(
        'Item cannot be deleted because product is attached to it',
      );
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
    return prisma.item.findMany({
      where: {
        name: {
          contains: term,
          mode: 'insensitive',
        },
      },
      select: {
        name: true,
        id: true,
        photo: true,
      },
    });
  }

  async getItemsList(query: getItemListValidation) {
    return prisma.item.findMany({
      where: query,
      select: {
        id: true,
        name: true,
        photo: true,
      },
    });
  }
}
