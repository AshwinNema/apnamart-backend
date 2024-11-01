import { CloudinaryResponse } from 'src/utils/types';
import {
  processedUpdateProduct,
  stageDescriptionInDatabase,
} from '../interfaces';

export const getDataUpdateMaps = (processedBody: processedUpdateProduct) => {
  const updatedImgIdMap =
    processedBody?.updatedDescriptionImgIds?.reduce?.(
      (idMap: { [key: string]: true }, stageId) => {
        idMap[stageId] = true;
        return idMap;
      },
      {},
    ) || {};

  const originalStagesIdMap =
    (
      processedBody.currentDescription.details as stageDescriptionInDatabase[]
    )?.reduce?.((idMap: { [key: string]: true }, details) => {
      if (details.photo) idMap[details.id] = true;
      return idMap;
    }, {}) || {};

  return {
    updatedImgIdMap,
    originalStagesIdMap,
  };
};
// getDeleteImgList = When an an image in description stage is updated, the previous image has to be deleted we get the list of deleted images
export const getDeleteImgList = (
  descriptionStages: stageDescriptionInDatabase[],
  updatedImgIdMap: { [key: string]: true },
  updatedImages: CloudinaryResponse[],
) => {
  let lastUpdateImgIndex = 0;
  const deletePhotoIds = [];
  descriptionStages?.forEach?.((stageDetails) => {
    const isImgUpdated = !!updatedImgIdMap[stageDetails.id];
    if (!isImgUpdated) return;
    const newImgDetails = updatedImages[lastUpdateImgIndex];
    stageDetails.photo &&
      deletePhotoIds.push(stageDetails.photo.cloudinary_public_id);
    stageDetails.photo = {
      url: newImgDetails.secure_url,
      cloudinary_public_id: newImgDetails.public_id,
    };
    lastUpdateImgIndex += 1;
  });
  return deletePhotoIds;
};

export const removeDeletedProductPhotos = (
  processedBody: processedUpdateProduct,
) => {
  processedBody.currentPhotos = processedBody.currentPhotos.filter(
    (details) =>
      !processedBody?.deletedProductImgIds.includes(
        details.cloudinary_public_id,
      ),
  );
};

export const addNewDescriptionPhotos = (
  updatedDescription: stageDescriptionInDatabase[],
  uploadedImages: CloudinaryResponse[],
  originalStagesIdMap: { [key: string]: true },
) => {
  let lastCreateImgIndex = 0;
  updatedDescription?.forEach?.((stageDetails) => {
    const isNewStage = !originalStagesIdMap[stageDetails.id];
    if (!isNewStage) return;
    const imgDetails = uploadedImages[lastCreateImgIndex];
    stageDetails.photo = {
      url: imgDetails.secure_url,
      cloudinary_public_id: imgDetails.public_id,
    };
    lastCreateImgIndex += 1;
  });
};
