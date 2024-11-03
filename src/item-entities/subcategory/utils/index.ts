import { QuerySubCategories } from 'src/validations/subcategory.validation';
import * as _ from 'lodash';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import prisma from 'src/prisma/client';
export * from './create-data.pipe';
export * from './update-data.pipe';
@Injectable()
export class SubCatDeleteValidator implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return value;
    }
    const subCatId = parseInt(value);
    const subCat = await prisma.subCategory.findUnique({
      where: {
        id: subCatId,
      },
    });

    if (!subCat) {
      throw new NotFoundException('Sub category not found');
    }
    const item = await prisma.item.findFirst({
      where: { subCategoryId: subCatId },
    });
    if (item) {
      throw new BadRequestException(
        'Sub Category cannot be deleted because it is attached with items',
      );
    }

    return value;
  }
}

export const getQuerySubCatArgs = (
  query: QuerySubCategories,
): [
  string,
  {
    limit: number;
    page: number;
  },
  {
    [key: string]: any;
    where?: object;
  },
] => {
  const paginationOptions = _.pick(query, ['limit', 'page']);
  const where = _.pick(query, ['id']);

  return [
    'subCategory',
    paginationOptions,
    {
      where,
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    },
  ];
};
