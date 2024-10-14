import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import prisma from 'src/prisma/client';

@Injectable()
export class DeleteItemValidatorPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') return value;
    const id = parseInt(value);

    const data = await prisma.item.findUnique({
      where: { id },
    });

    if (!data) {
      throw new BadRequestException('Item not found');
    }

    const product = await prisma.product.findFirst({
      where: {
        itemId: id,
      },
    });

    if (product) {
      throw new BadRequestException(
        'Item cannot be deleted because it is attached with products',
      );
    }
    return value;
  }
}
