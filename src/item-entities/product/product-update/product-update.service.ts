import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import { UpdateProductValidation } from 'src/validations';
import {
  processedUpdateProduct,
  stageDescriptionInDatabase,
} from '../interfaces';
import {
  addNewDescriptionPhotos,
  getDataUpdateMaps,
  getDeleteImgList,
  removeDeletedProductPhotos,
} from './data-processors';
import prisma from 'src/prisma/client';
import * as _ from 'lodash';

@Injectable()
export class ProductUpdateService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async updateProduct(
    id: number,
    body: UpdateProductValidation,
    processedBody: processedUpdateProduct,
  ) {
    const deleteFileList: string[] = [];
    if (processedBody?.deletedProductImgIds?.length) {
      deleteFileList.push(...processedBody.deletedProductImgIds);
      removeDeletedProductPhotos(processedBody);
    }

    if (body.productImages) {
      const newImages = await Promise.all(
        await this.cloudinaryService.uploadFiles(body.productImages),
      );

      newImages.forEach((imgDetails) => {
        processedBody.currentPhotos.push({
          url: imgDetails.secure_url,
          cloudinary_public_id: imgDetails.public_id,
        });
      });
    }

    const updatedDescription =
      processedBody?.updateDetails?.description ||
      processedBody.currentDescription.details;

    if (processedBody?.deletedDescriptionPhotos?.length) {
      deleteFileList.push(...processedBody?.deletedDescriptionPhotos);
    }

    const { updatedImgIdMap, originalStagesIdMap } =
      getDataUpdateMaps(processedBody);
    if (processedBody?.updatedDescriptionImgIds?.length) {
      const updatedImages = await Promise.all(
        await this.cloudinaryService.uploadFiles(body.updatedDescriptionFiles),
      );
      const descriptionStages =
        updatedDescription as stageDescriptionInDatabase[];

      const deletePhotoIds = getDeleteImgList(
        descriptionStages,
        updatedImgIdMap,
        updatedImages,
      );
      if (deletePhotoIds.length) deleteFileList.push(...deletePhotoIds);
    }

    if (body.newDescriptionFiles) {
      const uploadedImages = await Promise.all(
        await this.cloudinaryService.uploadFiles(body.newDescriptionFiles),
      );
      addNewDescriptionPhotos(
        updatedDescription as stageDescriptionInDatabase[],
        uploadedImages,
        originalStagesIdMap,
      );
    }
    deleteFileList.length &&
      (await this.cloudinaryService.deleteFiles(deleteFileList));

    return prisma.product.update({
      where: { id },
      data: {
        photos: processedBody.currentPhotos,
        description: {
          details: updatedDescription,
        },
        ..._.omit(processedBody.updateDetails, ['description']),
      },
    });
  }
}
