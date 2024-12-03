import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ItemFilterType } from '@prisma/client';
import { priceFilterOptionValidation } from 'src/validations/item-validation/filter-subvalidations';

export const createUpdateDeleteValidation = (
  filter,
  filterMaps,
  optionDetails,
  nonDeletedNonUpdatedFilterOptionMap,
) => {
  const { createOptions, updateOptions, deleteOptions, filterType } = filter;
  const { productOptionsMap } = filterMaps;
  const { optionIdMap, optionNameToIdMap } = optionDetails;
  createOptions?.forEach((item) => {
    const { name } = item;
    const isDuplicateName = optionNameToIdMap[name];
    if (isDuplicateName) {
      throw new BadRequestException(
        `Option with name ${name} is already present in the system`,
      );
    }
  });

  updateOptions?.forEach((option) => {
    const { id, name } = option;
    const optionDetails = optionIdMap?.[id];
    nonDeletedNonUpdatedFilterOptionMap[id] = true;
    if (filterType === ItemFilterType.price) {
      priceFilterOptionValidation.parse(name);
    }

    if (!optionDetails) {
      throw new NotFoundException(`Option with name ${name} not found`);
    }

    if (name && optionNameToIdMap[name] && optionNameToIdMap[name] != id) {
      throw new BadRequestException(
        `Option with name ${name} is alredy present in the system`,
      );
    }
  });

  deleteOptions?.forEach((deleteId) => {
    if (!optionIdMap[deleteId]) {
      throw new NotFoundException('Option not found');
    }
    nonDeletedNonUpdatedFilterOptionMap[deleteId] = true;
    if (productOptionsMap[deleteId]) {
      throw new BadRequestException(
        `Options cannot be deleted because they are attached with products`,
      );
    }
  });
};
