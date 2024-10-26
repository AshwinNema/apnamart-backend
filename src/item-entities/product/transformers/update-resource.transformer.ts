import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import prisma from 'src/prisma/client';
import { UpdateProductResource, validateObject } from 'src/validations';

@Injectable()
export class UpdateResourcePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') {
      return value;
    }
    const { user, body, params } = value;
    {
      const { error, message } = await validateObject(
        body,
        UpdateProductResource,
        { whitelist: true, forbidNonWhitelisted: true },
      );
      if (error) {
        throw new UnprocessableEntityException(message);
      }
    }

    // const data = await prisma.productPhoto.findUnique({
    //   where: { id: parseInt(params.id) },
    //   include: {
    //     photos: true,
    //     thumbnail: true,
    //   },
    // });

    // if (!data) {
    //   throw new NotFoundException('Resource not found');
    // }

    // const merchantId = data?.thumbnail?.merchant || data?.photos?.merchant;

    // if (user.id != merchantId) {
    //   throw new BadRequestException(
    //     'Invalid Request.Merchant does not has access to the resource.',
    //   );
    // }

    // body.data = data;
    // return body;
  }
}
