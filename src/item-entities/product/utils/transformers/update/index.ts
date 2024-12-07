import { ArgumentMetadata, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import {
  updateProductBasicValidation,
  UpdateProductValidation,
} from 'src/validations';
import * as _ from 'lodash';
import { validateProductAndGetFilterOptionsQuery } from './sub-validations/validate-product';
import { validateDescriptionImgsAndGetDeletedDescriptionIds } from './sub-validations/validate-description';
import {
  processedUpdateProduct,
  updateProductDetails,
} from 'src/item-entities/product/interfaces';
import { validateProductImages } from './sub-validations/validate-product-images';

@Injectable()
export class UpdateProductTransformer {
  cloudinaryService: CloudinaryService;
  constructor() {
    this.cloudinaryService = new CloudinaryService();
  }

  async transform(
    value: any,
    metadata: ArgumentMetadata,
  ): Promise<processedUpdateProduct> {
    if (metadata.type !== 'custom') {
      return value;
    }
    let {
      params: { id },
    } = value;
    const { user } = value;
    id = parseInt(id);
    const body: UpdateProductValidation = value.body;
    const parsedData = JSON.parse(body.data);
    const details = _.pick(parsedData, [
      'name',
      'itemId',
      'price',
      'filterOptions',
      'updatedDescriptionImgIds',
      'specification',
      'deletedProductImgIds',
      'description',
      'highlights',
      'allowedUnitsPerOrder',
    ]);
    const basicProductDetails = updateProductBasicValidation.parse(details);
    const { filterQuery, description, photos } =
      await validateProductAndGetFilterOptionsQuery(
        id,
        user,
        details.itemId,
        details.filterOptions,
      );

    const deletedDescriptionPhotos: string[] =
      validateDescriptionImgsAndGetDeletedDescriptionIds(
        description,
        body,
        details,
        parsedData,
      );

    validateProductImages(
      photos,
      body.productImages,
      basicProductDetails.deletedProductImgIds,
    );

    const updateDetails: updateProductDetails = _.pick(basicProductDetails, [
      'name',
      'itemId',
      'price',
      'specification',
      'description',
      'highlights',
      'allowedUnitsPerOrder',
    ]);

    updateDetails.filterOptions = filterQuery.filterOptions;
    return {
      updateDetails,
      updatedDescriptionImgIds: basicProductDetails.updatedDescriptionImgIds,
      deletedProductImgIds: basicProductDetails.deletedProductImgIds,
      deletedDescriptionPhotos,
      currentDescription: description,
      currentPhotos: photos,
    };
  }
}
