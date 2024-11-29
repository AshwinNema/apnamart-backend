import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ItemFilterType } from '@prisma/client';
import { priceFilterValidation } from 'src/validations/item-validation/filter-subvalidations';
import { createUpdateDeleteValidation } from './sub-validations';

export const validateUpdateFilters = (
  updateFilters,
  filterMaps,
  mainFilterDetails,
) => {
  const { idMap, nameToIdMap } = filterMaps;
  updateFilters?.forEach?.((filter, index) => {
    const { id, name, createOptions, deleteOptions, filterType } = filter;
    const nonDeletedNonUpdatedFilterOptionMap = {};
    mainFilterDetails.updatedIdToDetailsMap[id] = {
      index,
      ...filter,
    };

    if (
      filterType &&
      filterType !== ItemFilterType.normal &&
      filterMaps.differentFilterTypeToIdMap[filterType] !== id
    ) {
      mainFilterDetails.updatedDifferentFilterTypeMap[filterType] = true;
    }

    const optionDetails = idMap[id];
    if (!optionDetails) {
      throw new NotFoundException(
        `Filter with name ${name} is not present in the system`,
      );
    }

    if (name && nameToIdMap[name] && nameToIdMap[name] != id) {
      throw new BadRequestException(
        `Filter with name ${name} is already present in the system`,
      );
    }

    const { optionIdMap } = optionDetails;
    if (filterType === ItemFilterType.price) {
      priceFilterValidation({ options: createOptions });
    }

    createUpdateDeleteValidation(
      filter,
      filterMaps,
      optionDetails,
      nonDeletedNonUpdatedFilterOptionMap,
    );

    const newFilterOptionCount =
      Object.keys(optionIdMap).length +
      (createOptions?.length || 0) -
      (deleteOptions?.length || 0);

    if (newFilterOptionCount === 0)
      throw new BadRequestException('There has to be one option in the filter');

    if (filterType === ItemFilterType.price) {
      const optionIdList = Object.keys(optionIdMap);
      const priceNonUpdateOptions = [];
      optionIdList.forEach((id) => {
        const isUpdatedOrDeleted = !!nonDeletedNonUpdatedFilterOptionMap[id];
        if (isUpdatedOrDeleted) return;
        const optionName = optionIdMap?.[id];
        priceNonUpdateOptions.push({ name: optionName });
      });
      priceNonUpdateOptions.length &&
        priceFilterValidation({ options: priceNonUpdateOptions });
    }
  });
};
