import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { UserInterface } from 'src/interfaces';
import prisma from 'src/prisma/client';
import { Product } from 'src/validations';
import * as _ from 'lodash';

@Injectable()
export class ProductCreateTransformer implements PipeTransform {
  processData(data, user: UserInterface) {
    data.subCategory = {
      connect: { id: data.subCategoryId },
    };
    data.user = {
      connect: { id: user.id },
    };
    if (data?.filterOptions?.length) {
      data.filterOptions = {
        connect: data.filterOptions.map((id) => ({ id })),
      };
    }

    return _.omit(data, ['subCategoryId', 'merchant']);
  }

  async validate(data: Product) {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: data.subCategoryId },
    });
    if (!subCategory) {
      throw new NotFoundException('Sub Category not found');
    }

    if (!data.filterOptions.length) {
      return;
    }

    const options = await prisma.subCategoryFilterOption.findMany({
      where: {
        id: {
          in: data.filterOptions,
        },
        filter: {
          subCategoryId: data.subCategoryId,
        },
      },
    });
    if (options.length != data.filterOptions.length) {
      throw new NotFoundException('Options not found');
    }
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') {
      return value;
    }
    const { user, body } = value;
    const parsedData = JSON.parse(body.data);
    await this.validate(parsedData);
    body.data = this.processData(parsedData, user);
    return body;
  }
}
