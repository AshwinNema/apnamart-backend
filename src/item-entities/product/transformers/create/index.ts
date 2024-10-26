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
import { z } from 'zod';
import {
  seriesDescriptionValidation,
  seriesSpecification,
} from 'src/validations/product/subvalidations';
import { itemValidation } from './validations';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';

@Injectable()
export class ProductCreateTransformer implements PipeTransform {
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
    ]);
    const basicProductDetails = basicProductDetailsValidation.parse(details);
    await itemValidation(details.itemId, details.filterOptions);

    const description = Array.isArray(parsedData.description)
      ? seriesDescriptionValidation.parse(parsedData.description)
      : z.string().min(1).parse(parsedData.description);

    if (body?.descriptionFiles?.length > 4) {
      throw new BadRequestException(
        'There cannot be more than 4 images attached for description',
      );
    }

    if (
      Array.isArray(
        body?.descriptionFiles
          ? body?.descriptionFiles?.length
          : 1 != description?.length,
      )
    ) {
      throw new BadRequestException(
        'Description images must be equal to the total stages n the description',
      );
    }

    const specification = Array.isArray(parsedData.specification)
      ? seriesSpecification.parse(parsedData.specification)
      : z.string().min(1).parse(parsedData.specification);

    if (!body.productImages) {
      throw new BadRequestException(
        'Please attach atleast one image of the product',
      );
    }

    const user = value.user;

    return {
      name: basicProductDetails.name,
      itemId: basicProductDetails.itemId,
      price: basicProductDetails.price,
      merchant: user.id,
      description: {
        details: description,
      },
      specification,
      filterOptions: {
        connect: basicProductDetails.filterOptions.map((optionId) => ({
          id: optionId,
        })),
      },
    };
  }
}
