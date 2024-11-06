import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import prisma from 'src/prisma/client';
import { UpdateSubCategoryValidation } from 'src/validations';

@Injectable()
export class UpdateSubCatValidator implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') return value;
    const body: UpdateSubCategoryValidation = value.body;
    let {
      params: { id },
    } = value;
    id = parseInt(id);
    const data = await prisma.subCategory.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('Sub category data not found');
    }

    if (
      body.categoryId &&
      body.categoryId !== data.categoryId &&
      !(await prisma.category.findUnique({
        where: {
          id: body.categoryId,
        },
      }))
    ) {
      throw new BadRequestException('Category not found');
    }
    if (body.name) {
      const filter = { id: { not: id }, name: body.name, categoryId: null };
      if (body.categoryId) {
        filter.categoryId = body.categoryId;
      } else {
        filter.categoryId = data.categoryId;
      }
      const duplicateData = await prisma.subCategory.findFirst({
        where: filter,
      });
      if (duplicateData) {
        throw new BadRequestException(
          'Sub category with this name is already present in the system for the given category',
        );
      }
    }
    if (body.categoryId && body.categoryId != data.categoryId) {
      value.body.items = {
        updateMany: {
          where: { archive: false, subCategoryId: id },
          data: {
            categoryId: body.categoryId,
          },
        },
      };
    }
    return value;
  }
}
