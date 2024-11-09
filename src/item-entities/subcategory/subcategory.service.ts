import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import { CloudinaryResponse } from '../../utils/types';
import prisma from 'src/prisma/client';

@Injectable()
export class SubcategoryService {
  constructor(private cloudinaryService: CloudinaryService) {}

  getUniqueSubCategory(filter: Prisma.SubCategoryWhereUniqueInput) {
    return prisma.subCategory.findUnique({
      where: filter,
    });
  }

  getOneSubCategory(filter) {
    return prisma.subCategory.findFirst({ where: filter });
  }

  async createSubCategory(
    body: Prisma.SubCategoryUncheckedCreateInput,
    file: Express.Multer.File,
  ) {
    const uploadedFile: CloudinaryResponse =
      await this.cloudinaryService.uploadFile(file);
    return prisma.subCategory.create({
      data: {
        ...body,
        photo: uploadedFile.secure_url,
        cloudinary_public_id: uploadedFile.public_id,
      },
    });
  }

  async updateSubCategoryById(
    id: number,
    update: Prisma.SubCategoryUpdateInput,
  ) {
    return prisma.subCategory.update({
      where: { id },
      data: update,
    });
  }

  async updateSubcategoryImg(id: number, file: Express.Multer.File) {
    await this.cloudinaryService.deletePrismaEntityFile('subCategory', id);
    return this.cloudinaryService.updatePrismaEntityFile(
      'subCategory',
      id,
      file,
    );
  }

  getSubCategories() {
    return prisma.subCategory.findMany({});
  }

  async searchByName(term: string) {
    return prisma.$queryRaw`SELECT "id", "name", "photo" FROM "public"."SubCategory" WHERE ("archive"=false AND to_tsvector('english', "public"."SubCategory"."name") @@ to_tsquery('english', ${term}));`;
  }

  async deleteSubCatById(id: number) {
    const itemAttached = await prisma.item.findFirst({
      where: {
        subCategoryId: id,
      },
    });

    if (itemAttached)
      throw new BadRequestException(
        'Sub category cannot be deleted because it is attached with item',
      );
    return prisma.subCategory.update({
      where: { id },
      data: { archive: true },
    });
  }

  async getSubCatList(filter: Prisma.SubCategoryWhereInput) {
    return prisma.subCategory.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        photo: true,
      },
      omit: null,
    });
  }
}
