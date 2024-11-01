import { BadRequestException } from '@nestjs/common';
import {
  basicProductUpdateDetails,
  databaseDescription,
} from 'src/item-entities/product/interfaces';
import {
  requiredStringValidation,
  UpdateProductValidation,
} from 'src/validations';
import { seriesDescriptionValidation } from 'src/validations/product/subvalidations';
import { updateCreateDeleteDescriptionImgsValidation } from './update-create-delete-description-imgs-validation';

export const validateDescriptionImgsAndGetDeletedDescriptionIds = (
  description: databaseDescription,
  body: UpdateProductValidation,
  productDetails: basicProductUpdateDetails,
  parsedData,
): string[] => {
  if (
    !parsedData.description &&
    !body.newDescriptionFiles &&
    !body.updatedDescriptionFiles
  )
    return [];
  // If the description is of type string
  if (typeof parsedData.description === 'string') {
    requiredStringValidation('Description').parse(parsedData.description);
    if (body.newDescriptionFiles || body.updatedDescriptionFiles) {
      throw new BadRequestException(
        'Description files cannot be attached with a text based description',
      );
    }

    // We have to delete all the images
    return typeof description.details === 'string'
      ? []
      : description.details.reduce((list, details) => {
          details.photo && list.push(details.photo.cloudinary_public_id);
          return list;
        }, []);
  }

  // When description does not have any photos attached to them or it is not a stages based description
  if (!Array.isArray(description.details) || !description?.details[0]?.photo) {
    if (body.updatedDescriptionFiles) {
      throw new BadRequestException('Invalid update description files');
    }

    if (body.newDescriptionFiles) {
      const descriptionDetails = seriesDescriptionValidation.parse(
        parsedData.description,
      );
      const descriptionStagesCount = descriptionDetails.length;
      const descriptionFileCount = !body.newDescriptionFiles
        ? 0
        : body.newDescriptionFiles?.length || 0;
      if (descriptionStagesCount != descriptionFileCount) {
        throw new BadRequestException(
          'Description files should be attached with each of the description stages',
        );
      }
    }
    return !Array.isArray(description.details)
      ? []
      : description.details?.reduce((list, details) => {
          const { photo } = details;
          photo && list.push(photo.cloudinary_public_id);
          return list;
        }, []);
  }

  const updateFilesCount = !body.updatedDescriptionFiles
    ? 0
    : body?.updatedDescriptionFiles?.length || 1;

  const updateIdCount = productDetails?.updatedDescriptionImgIds?.length || 0;

  if (updateFilesCount != updateIdCount) {
    throw new BadRequestException(
      'For all the description stages being updated, kindly provide images',
    );
  }
  return updateCreateDeleteDescriptionImgsValidation(
    parsedData,
    description,
    body,
    productDetails,
  );
};
