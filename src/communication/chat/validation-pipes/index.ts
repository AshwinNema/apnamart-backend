import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ClassConstructor } from 'class-transformer';
import { validateObject } from 'src/validations';

export * from './initiate-merchant-admin-chat.pipe';

@Injectable()
export class WsClassValidator<T extends object> implements PipeTransform {
  constructor(private validatorClass: ClassConstructor<T>) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;
    const { error, message } = await validateObject(
      value,
      this.validatorClass,
      {
        whitelist: true,
        forbidNonWhitelisted: true,
      },
    );

    if (error) throw new WsException(message);
    return value;
  }
}
