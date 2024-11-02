import { BadRequestException } from '@nestjs/common';
import {
  basicProductUpdateDetails,
  databaseDescription,
  stageDescriptionInDatabase,
} from 'src/item-entities/product/interfaces';
import { UpdateProductValidation } from 'src/validations';
import { seriesDescriptionValidation } from 'src/validations/product/subvalidations';

export const updateCreateDeleteDescriptionImgsValidation = (
  parsedData,
  description: databaseDescription,
  body: UpdateProductValidation,
  productDetails: basicProductUpdateDetails,
) => {
  const deletedPhotos: string[] = [];

  const newFilesCount = !body.newDescriptionFiles
    ? 0
    : body.newDescriptionFiles?.length || 1;

  if (newFilesCount && !parsedData.description) {
    throw new BadRequestException(
      'New files cannot be attached without attaching new description stages',
    );
  }
  const descriptionDetails =
    description.details as stageDescriptionInDatabase[];
  const descriptionIdsMap = descriptionDetails.reduce((idMap, details) => {
    idMap[details.id] = true;
    return idMap;
  }, {});

  const updatedImgIdMap =
    productDetails?.updatedDescriptionImgIds?.reduce?.(
      (idMap, descriptionId) => {
        idMap[descriptionId] = true;
        if (!descriptionIdsMap[descriptionId]) {
          throw new BadRequestException('Stage not present in the description');
        }
        return idMap;
      },
      {},
    ) || {};

  if (parsedData.description) {
    const newDescriptionDetails = seriesDescriptionValidation.parse(
      parsedData.description,
    );

    const { newDescriptionIdMap, newIds } = newDescriptionDetails.reduce(
      ({ newDescriptionIdMap, newIds }, details) => {
        const { id } = details;
        newDescriptionIdMap[id] = true;
        const isNewId = !descriptionIdsMap[details.id];
        if (isNewId) newIds.push(id);
        return { newDescriptionIdMap, newIds };
      },
      {
        newDescriptionIdMap: {},
        newIds: [],
      },
    );

    if (newFilesCount != newIds.length) {
      throw new BadRequestException(
        'Please provide image for every description stage',
      );
    }

    const deletedImgIds: string[] = descriptionDetails.reduce(
      (list, details) => {
        const isDeletedStage = !newDescriptionIdMap[details.id];
        if (isDeletedStage) {
          if (updatedImgIdMap[details.id]) {
            throw new BadRequestException(
              'For a description stage that is deleted, image cannot be updated',
            );
          }
          details?.photo && list.push(details?.photo.cloudinary_public_id);
        }
        return list;
      },
      [],
    );
    deletedPhotos.push(...deletedImgIds);
    const newFileCount =
      descriptionDetails.filter((details) => !!details.photo).length +
      newFilesCount -
      deletedPhotos.length;
    const fileLimitExceeded = newFileCount > 4;
    const noFiles = newFileCount === 0;
    if (fileLimitExceeded || noFiles) {
      throw new BadRequestException(
        fileLimitExceeded
          ? 'There cannot be more than 4 files in the description'
          : 'Atleast one file has to be attached with description',
      );
    }
  }

  return deletedPhotos;
};
