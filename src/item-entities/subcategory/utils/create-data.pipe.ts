import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import prisma from 'src/prisma/client';
import { SubCategoryValidator } from 'src/validations/subcategory.validation';

export const subCategoryCreateProcessor = (
  subCategoryData: SubCategoryValidator,
) => {
  return subCategoryData;
};

const validatePipeData = async (data: SubCategoryValidator) => {
  const categoryData = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!categoryData) {
    throw new NotFoundException('Category not found');
  }

  if (
    await prisma.subCategory.findFirst({
      where: { name: data.name, categoryId: data.categoryId },
    })
  ) {
    throw new BadRequestException(
      'Sub category with the given name already present for category',
    );
  }
};

@Injectable()
export class SubCatCrtDataPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') {
      return value;
    }
    const { user, body } = value;
    body.data = JSON?.parse?.(body.data);
    await validatePipeData(body.data);
    body.data.createdBy = user.id;
    if (body?.data?.filters) {
      body.data.filters = {
        create: body.data.filters.map((filter) => {
          if (filter?.options?.length) {
            filter.options = {
              create: filter.options.map((option) => {
                option.createdBy = user.id;
                return option;
              }),
            };
          }
          filter.createdBy = user.id;
          return filter;
        }),
      };
    }
    return value;
  }
}
