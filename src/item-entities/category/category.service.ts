import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryData, UserInterface } from 'src/interfaces';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import { CloudinaryResponse } from '../../utils/types';
import { Prisma } from '@prisma/client';
import prisma from 'src/prisma/client';
import { ItemService } from '../item/item.service';

@Injectable()
export class CategoryService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private itemService: ItemService,
  ) {}

  async getUnqiueCategory(filter: Prisma.CategoryWhereUniqueInput) {
    return prisma.category.findUnique({
      where: filter,
    });
  }

  async createCategory(
    data: CreateCategoryData,
    file: Express.Multer.File,
    user: UserInterface,
  ) {
    if (
      await prisma.category.findFirst({
        where: { name: data.name },
      })
    ) {
      throw new BadRequestException('Category with this name already present');
    }
    const uploadedFile: CloudinaryResponse =
      await this.cloudinaryService.uploadFile(file);

    return prisma.category.create({
      data: {
        ...data,
        photo: uploadedFile.secure_url,
        cloudinary_public_id: uploadedFile.public_id,
        createdBy: user.id,
      },
    });
  }

  async updateCategory(id: number, update: Prisma.CategoryUpdateInput) {
    if (
      update.name &&
      (await prisma.category.findFirst({
        where: { id: { not: id }, name: update.name as string },
      }))
    ) {
      throw new BadRequestException(
        'Category with same name is already present in database',
      );
    }
    return prisma.category.update({ where: { id }, data: update });
  }

  async updateCategoryImg(id: number, file: Express.Multer.File) {
    await this.cloudinaryService.deletePrismaEntityFile('category', id);
    return this.cloudinaryService.updatePrismaEntityFile('category', id, file);
  }

  async deleteCategoryById(id: number) {
    const cat = await this.getUnqiueCategory({ id });
    if (!cat) {
      throw new NotFoundException('Category not found');
    }

    if (
      await this.itemService.getOneItem({
        categoryId: id,
      })
    ) {
      throw new BadRequestException(
        'Category cannot be deleted because it is attached with an item',
      );
    }
    await prisma.category.update({ where: { id }, data: { archive: true } });
  }

  async searchByName(term: string) {
    return prisma.$queryRaw`SELECT "id", "name", "photo" FROM "public"."Category" WHERE ("archive"=false AND to_tsvector('english', "public"."Category"."name") @@ to_tsquery('english', ${term}));`;
  }

  async getCatList() {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        photo: true,
      },
      omit: null,
    });
  }
}
