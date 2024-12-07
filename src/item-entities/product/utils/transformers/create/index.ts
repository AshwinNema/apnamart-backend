import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  basicProductDetailsValidation,
  CreateProductValidation,
} from 'src/validations';
import * as _ from 'lodash';
import { descriptionFileValidation, itemValidation } from './validations';
import { createProductProcessedBody } from 'src/item-entities/product/interfaces';
import prisma from 'src/prisma/client';
import { MerchantRegistrationStatus } from '@prisma/client';

@Injectable()
export class CreateProductTransformer implements PipeTransform {
  async transform(
    value: any,
    metadata: ArgumentMetadata,
  ): Promise<createProductProcessedBody> {
    if (metadata.type !== 'custom') {
      return value;
    }
    const registration = await prisma.merchantDetails.findUnique({
      where: { userId: value.user.id },
    });

    if (
      !registration ||
      registration.registrationStatus != MerchantRegistrationStatus.completed
    ) {
      throw new BadRequestException(
        'Product can only be created after merchant registration is completed',
      );
    }
    const body: CreateProductValidation = value.body;
    const parsedData = JSON.parse(body.data);
    const details = _.pick(parsedData, [
      'name',
      'itemId',
      'price',
      'filterOptions',
      'specification',
      'description',
      'highlights',
      'allowedUnitsPerOrder',
    ]);
    const basicProductDetails = basicProductDetailsValidation.parse(details);
    await itemValidation(details.itemId, details.filterOptions);
    descriptionFileValidation(body, basicProductDetails);
    const productImgLength = !body.productImages
      ? 0
      : body?.productImages?.length || 1;
    if (!productImgLength) {
      throw new BadRequestException(
        'Please attach atleast one image of the product',
      );
    }

    if (productImgLength > 20) {
      throw new BadRequestException(
        'Only maximum of 20 product images are allowed',
      );
    }

    const user = value.user;

    return {
      name: basicProductDetails.name,
      itemId: basicProductDetails.itemId,
      price: basicProductDetails.price,
      merchant: user.id,
      description: {
        details: basicProductDetails.description,
      },
      allowedUnitsPerOrder: basicProductDetails.allowedUnitsPerOrder,
      highlights: basicProductDetails.highlights,
      specification: basicProductDetails.specification,
      filterOptions: {
        connect: basicProductDetails.filterOptions.map((optionId) => ({
          id: optionId,
        })),
      },
      isBlocked: registration.isMerchantBlocked,
    };
  }
}
