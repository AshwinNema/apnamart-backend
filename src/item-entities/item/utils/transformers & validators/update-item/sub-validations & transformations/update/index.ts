import { BadRequestException } from '@nestjs/common';
import prisma from 'src/prisma/client';
import { UpdateItem } from 'src/validations';

export const validateUpdatedCatSubCat = async (
  body: UpdateItem,
  id: number,
  data: { categoryId: number; subCategoryId: number; name: string },
) => {
  const updatedCategoryId = body.categoryId || data.categoryId;
  const updatedSubCategoryId = body.subCategoryId || data.subCategoryId;
  if (
    body.name &&
    data.name !== body.name &&
    (await prisma.item.findFirst({
      where: {
        id: { not: id },
        name: body.name,
        categoryId: updatedCategoryId,
        subCategoryId: updatedSubCategoryId,
      },
    }))
  ) {
    throw new BadRequestException(
      'Item with the same name is already present in the system',
    );
  }

  if (
    (body.categoryId || body.subCategoryId) &&
    (data.subCategoryId != updatedSubCategoryId ||
      data.categoryId != updatedCategoryId)
  ) {
    const subCategoryData = await prisma.subCategory.findUnique({
      where: { id: updatedSubCategoryId },
      include: {
        category: true,
      },
    });
    if (!subCategoryData)
      throw new BadRequestException('Sub category not found');
    if (subCategoryData.category.id != updatedCategoryId)
      throw new BadRequestException('Sub category not linked with category');
  }
};

export * from './validate-update-filters';
