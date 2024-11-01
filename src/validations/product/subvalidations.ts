import { z } from 'zod';
import { requiredStringValidation } from '..';

const seriesBaseValidation = z.object({
  id: requiredStringValidation('Id'),
  header: z.string().min(1).optional(),
});

export const keyValValidation = z.object({
  id: requiredStringValidation('Id'),
  key: requiredStringValidation('Feature key'),
  val: requiredStringValidation('Feature value'),
});

const seriesStageValidation = seriesBaseValidation.merge(
  z.object({
    details: z.union([
      requiredStringValidation('description stage'),
      z.array(keyValValidation).min(1, {
        message: 'Feature key and value is required',
      }),
    ]),
  }),
);

export const seriesDescriptionValidation = z
  .array(seriesStageValidation)
  .min(1);

export const updateSeriesDescriptionValidation = z
  .array(
    seriesStageValidation.merge(
      z.object({
        photo: z
          .object({
            url: requiredStringValidation('Image url'),
            cloudinary_public_id: requiredStringValidation('Image id'),
          })
          .optional(),
      }),
    ),
  )
  .min(1);

export const seriesSpecification = z
  .array(
    seriesBaseValidation.merge(
      z.object({
        keyVals: z.array(keyValValidation).min(1, {
          message: 'There should be atleast one feature key and value',
        }),
      }),
    ),
  )
  .min(1);

export const updateProductBasicValidation = z.object({
  name: requiredStringValidation('Name').optional(),
  itemId: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  filterOptions: z.array(z.number().positive().int()).optional(),
  updatedDescriptionImgIds: z.array(z.string()).optional(),
  specification: z
    .union([requiredStringValidation('Specification'), seriesSpecification])
    .optional(),
  deletedProductImgIds: z
    .array(requiredStringValidation('Image Id'))
    .optional(),
  description: z
    .union([
      updateSeriesDescriptionValidation,
      requiredStringValidation('Description'),
    ])
    .optional(),
});

export const basicProductDetailsValidation = z.object({
  name: requiredStringValidation('Name'),
  itemId: z.number().int().positive(),
  price: z.number().positive(),
  filterOptions: z.array(z.number().positive().int()),
  specification: z.union([
    requiredStringValidation('Specification'),
    seriesSpecification,
  ]),
  description: z.union([
    seriesDescriptionValidation,
    requiredStringValidation('Description'),
  ]),
});
