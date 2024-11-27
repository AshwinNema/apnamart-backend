import { BadRequestException } from '@nestjs/common';
import { uploadedPhoto } from 'src/item-entities/product/interfaces';
import { UpdateProductValidation } from 'src/validations';

export const validateProductImages = (
  photos: uploadedPhoto[],
  newFiles: UpdateProductValidation['productImages'],
  deletedProductImgIds?: string[],
) => {
  if (deletedProductImgIds) {
    const productPhotoMap = photos.reduce((photoMap, details) => {
      photoMap[details.cloudinary_public_id] = true;
      return photoMap;
    }, {});

    deletedProductImgIds?.forEach?.((photoId) => {
      if (!productPhotoMap[photoId]) {
        throw new BadRequestException(
          'Product image that was to be deleted could not be found',
        );
      }
    });
  }

  const newProductFileCount =
    photos.length +
    (!newFiles ? 0 : newFiles?.length || 1) -
    (deletedProductImgIds?.length || 0);
  if (newProductFileCount === 0) {
    throw new BadRequestException('There has to be atleast one product image');
  }
  if (newProductFileCount > 20) {
    throw new BadRequestException('New image count cannot exceed more than 20');
  }
};
