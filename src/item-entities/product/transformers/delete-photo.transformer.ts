import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import prisma from 'src/prisma/client';

@Injectable()
export class DeletePhotoPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') {
      return value;
    }
    const { user, params } = value;

    // const data = await prisma.productPhoto.findUnique({
    //   where: { id: parseInt(params.id) },
    //   include: {
    //     photos: true,
    //   },
    // });

    // if (!data) {
    //   throw new NotFoundException('Resource not found');
    // }

    // const merchantId = data?.photos?.merchant || null;

    // if (user.id != merchantId) {
    //   throw new BadRequestException(
    //     'Invalid Request. Merchant does not has access to the resource.',
    //   );
    // }
    // return data;
  }
}
