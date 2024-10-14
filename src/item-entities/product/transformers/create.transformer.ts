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
    data.item = {
      connect: { id: data.itemId },
    };
    data.user = {
      connect: { id: user.id },
    };
    if (data?.filterOptions?.length) {
      data.filterOptions = {
        connect: data.filterOptions.map((id) => ({ id })),
      };
    }

    return _.omit(data, ['categoryId', 'merchant']);
  }

  async validate(data: Product) {
    const item = await prisma.item.findUnique({
      where: { id: data.itemId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
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
