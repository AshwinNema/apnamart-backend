import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import prisma from 'src/prisma/client';
import { CreateItemValidator } from 'src/validations';

const validateCreateItem = async (data: CreateItemValidator) => {
  const categoryData = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!categoryData) {
    throw new NotFoundException('Sub category not found');
  }

  const duplicate = await prisma.item.findFirst({
    where: { categoryId: data.categoryId, name: data.name },
  });
  if (duplicate) {
    throw new NotFoundException(
      'Item with the same name is already present in the system',
    );
  }
};

@Injectable()
export class ValidateAndTransformCreateDataPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') {
      return value;
    }
    const { user, body } = value;
    const data = JSON.parse(body.data);
    await validateCreateItem(data);
    data.createdBy = user.id;
    if (!data?.filters?.length) return;
    data.filters = {
      create: data.filters.map((filter) => {
        filter.createdBy = user.id;
        filter.options = {
          create: filter.options.map((option) => {
            option.createdBy = user.id;
            return option;
          }),
        };
        return filter;
      }),
    };
    body.data = data;
    value.body = body;
    return value;
  }
}
