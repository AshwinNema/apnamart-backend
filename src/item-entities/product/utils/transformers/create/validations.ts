import { BadRequestException } from '@nestjs/common';
import prisma from 'src/prisma/client';
import { CreateProductValidation } from 'src/validations';

export const itemValidation = async (itemId: number, options: number[]) => {
  const itemData = await prisma.item.findUnique({
    where: {
      id: itemId,
      category: {
        archive: false,
      },
    },
    include: {
      filters: {
        where: { archive: false },
        include: {
          options: {
            where: { archive: false },
          },
        },
      },
    },
  });

  if (!itemData) throw new BadRequestException('Item not found');
  const totalFilters = itemData.filters.length;
  const optionsLength = options.length;
  if (totalFilters != optionsLength) {
    throw new BadRequestException('Please select all the filters');
  }

  const optionMap = itemData.filters.reduce((optionMap, filterDetails) => {
    filterDetails.options.forEach((optionDetails) => {
      optionMap[optionDetails.id] = filterDetails.id;
    });
    return optionMap;
  }, {});

  const duplicateOptionChecker = {};
  options.forEach((optionId) => {
    const filterId = optionMap[optionId];
    if (!filterId) {
      throw new BadRequestException('Filter option not found');
    }
    const hasSelectedMoreOptions = !!duplicateOptionChecker[filterId];
    if (hasSelectedMoreOptions) {
      throw new BadRequestException(
        'Only one option from each filter can beselected',
      );
    }
    duplicateOptionChecker[filterId] = true;
  });
};

export const descriptionFileValidation = (
  body: CreateProductValidation,
  basicProductDetails: {
    description?:
      | string
      | {
          id?: string;
          header?: string;
          details?:
            | string
            | {
                id?: string;
                key?: string;
                val?: string;
              }[];
        }[];
  },
) => {
  const descriptionFileLength = !body?.descriptionFiles
    ? 0
    : body?.descriptionFiles?.length || 1;
  if (descriptionFileLength > 4) {
    throw new BadRequestException(
      'There cannot be more than 4 images attached for description',
    );
  }
  if (
    !Array.isArray(basicProductDetails.description) &&
    body?.descriptionFiles
  ) {
    throw new BadRequestException(
      'Description images can only be attached with stages description',
    );
  }
  if (
    body?.descriptionFiles &&
    basicProductDetails?.description?.length != descriptionFileLength
  ) {
    throw new BadRequestException(
      'Description images must be equal to the total stages in the description',
    );
  }
};
