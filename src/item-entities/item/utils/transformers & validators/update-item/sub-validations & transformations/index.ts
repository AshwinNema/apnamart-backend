import { NotFoundException } from '@nestjs/common';
import { ItemFilterType } from '@prisma/client';
import { priceFilterValidation } from 'src/validations/item-validation/filter-subvalidations';

export * from './update';

export const validateNewFilters = (
  newFilters,
  nameToIdMap,
  updatedDifferentFilterTypeMap,
) => {
  newFilters?.forEach?.((filter) => {
    const { name, filterType } = filter;
    if (filterType !== ItemFilterType.normal) {
      updatedDifferentFilterTypeMap[filterType] = true;
    }

    if (filterType === ItemFilterType.price) {
      priceFilterValidation(filter);
    }

    const isDuplicateName = nameToIdMap[name];
    if (isDuplicateName) {
      throw new NotFoundException(
        `Filter with name ${name} is already present in the system`,
      );
    }
  });
};

export const validateDeleteFilters = (
  deleteFilters,
  idMap,
  mainFilterDetails,
) => {
  deleteFilters?.forEach((filterId) => {
    const filterDetails = idMap[filterId];
    mainFilterDetails.deletedFilterIds[filterId] = true;
    if (!filterDetails) {
      throw new NotFoundException('Filter not found');
    }
  });
};

export const clearPreviousFilterTypes = (
  mainFilterDetails,
  filterMaps,
  value,
) => {
  const { differentFilterTypeToIdMap } = filterMaps;
  const {
    updatedDifferentFilterTypeMap,
    deletedFilterIds,
    updatedIdToDetailsMap,
  } = mainFilterDetails;

  Object.keys(updatedDifferentFilterTypeMap).forEach((filterType) => {
    const prevFilterId = differentFilterTypeToIdMap[filterType];
    if (!prevFilterId) return;
    const isPrevFilterDeleted = !!deletedFilterIds[prevFilterId];
    if (isPrevFilterDeleted) return;
    const prevFilterUpdateDetails = updatedIdToDetailsMap[prevFilterId];
    !prevFilterUpdateDetails &&
      value.body.updateFilters.push({
        id: prevFilterId,
        filterType: ItemFilterType.normal,
      });
    if (prevFilterUpdateDetails && !prevFilterUpdateDetails.filterType) {
      const { index } = prevFilterUpdateDetails;
      value.body.updateFilters[index].filterType = ItemFilterType.normal;
    }
  });
};
