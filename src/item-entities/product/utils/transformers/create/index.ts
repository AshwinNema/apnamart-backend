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
import { itemValidation } from './validations';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import { createProductProcessedBody } from 'src/item-entities/product/interfaces';

@Injectable()
export class CreateProductTransformer implements PipeTransform {
  cloudinaryService: CloudinaryService;
  constructor() {
    this.cloudinaryService = new CloudinaryService();
  }
  async transform(
    value: any,
    metadata: ArgumentMetadata,
  ): Promise<createProductProcessedBody> {
    if (metadata.type !== 'custom') {
      return value;
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
    ]);
    const basicProductDetails = basicProductDetailsValidation.parse(details);
    await itemValidation(details.itemId, details.filterOptions);

    const descriptionFileLength = !body?.descriptionFiles
      ? 0
      : body?.descriptionFiles?.length || 1;
    if (descriptionFileLength > 4) {
      throw new BadRequestException(
        'There cannot be more than 4 images attached for description',
      );
    }
    if (
      !Array.isArray(basicProductDetails.description) &&
      body?.descriptionFiles
    ) {
      throw new BadRequestException(
        'Description images can only be attached with stages description',
      );
    }
    if (
      body?.descriptionFiles &&
      basicProductDetails?.description?.length != descriptionFileLength
    ) {
      throw new BadRequestException(
        'Description images must be equal to the total stages in the description',
      );
    }

    const productImgLength = !body.productImages
      ? 0
      : body?.productImages?.length || 1;
    if (!productImgLength) {
      throw new BadRequestException(
        'Please attach atleast one image of the product',
      );
    }

    if (productImgLength > 4) {
      throw new BadRequestException(
        'Only maximum of 4 product images are allowed',
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
      specification: basicProductDetails.specification,
      filterOptions: {
        connect: basicProductDetails.filterOptions.map((optionId) => ({
          id: optionId,
        })),
      },
    };
  }
}
