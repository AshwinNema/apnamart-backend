export interface uploadedPhoto {
  url: string;
  cloudinary_public_id: string;
}

export interface stageDescription {
  id?: string;
  header?: string;
  details?:
    | string
    | {
        id?: string;
        key?: string;
        val?: string;
      }[];
}

export interface stageDescriptionInDatabase extends stageDescription {
  photo?: uploadedPhoto;
}

export interface databaseDescription {
  details: string | stageDescriptionInDatabase[];
}

export type specification =
  | string
  | {
      id?: string;
      header?: string;
      keyVals?: {
        id?: string;
        key?: string;
        val?: string;
      }[];
    }[];

export interface createProductProcessedBody {
  name: string;
  itemId: number;
  price: number;
  merchant: number;
  description: {
    details: string | stageDescription[];
  };
  specification: specification;
  filterOptions: {
    connect: {
      id: number;
    }[];
  };
  isBlocked: boolean;
  highlights: string[];
  allowedUnitsPerOrder: number;
}

export interface basicProductUpdateDetails {
  name?: string;
  itemId?: number;
  price?: number;
  filterOptions?: number[];
  updatedDescriptionImgIds?: string[];
}

export interface updateProductDetails {
  name?: string;
  allowedUnitsPerOrder?: number;
  itemId?: number;
  price?: number;
  specification?: specification;
  filterOptions?: {
    connect?: { id: number }[];
    disconnect?: { id: number }[];
  };
  description?: createProductProcessedBody['description']['details'];
  highlights?: string[];
}

export interface processedUpdateProduct {
  updateDetails: updateProductDetails;
  updatedDescriptionImgIds?: string[];
  deletedProductImgIds?: string[];
  deletedDescriptionPhotos?: string[];
  highlights?: string[];
  currentDescription: databaseDescription;
  currentPhotos: uploadedPhoto[];
}
