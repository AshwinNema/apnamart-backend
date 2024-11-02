import { BadRequestException } from '@nestjs/common';
import prisma from 'src/prisma/client';

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
