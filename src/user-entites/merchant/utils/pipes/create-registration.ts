import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import prisma from 'src/prisma/client';

@Injectable()
export class ValidateAndTransformCreateRegistrationPipe
  implements PipeTransform
{
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') return value;
    const { body, user } = value;
    const registration = await prisma.merchantDetails.findUnique({
      where: { userId: user.id },
    });

    if (registration) {
      throw new BadRequestException(
        'Registration for this user are already created',
      );
    }
    const data = JSON.parse(body.data);
    data.userId = user.id;
    value.body = {
      ...value.body,
      data,
    };
    return value;
  }
}
