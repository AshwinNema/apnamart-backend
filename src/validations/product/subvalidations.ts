import { z } from 'zod';
import { requiredStringValidation } from '..';

const seriesBaseValidation = z.object({
  id: z.string(),
  header: z.string().min(1).optional(),
});

export const keyValValidation = z.object({
  id: requiredStringValidation('Id'),
  key: requiredStringValidation('Feature key'),
  val: requiredStringValidation('Feature value'),
});

export const seriesDescriptionValidation = z
  .array(
    seriesBaseValidation.merge(
      z.object({
        details: z.union([
          requiredStringValidation('description stage'),
          z.array(keyValValidation).min(1, {
            message: 'Feature key and value is required',
          }),
        ]),
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
