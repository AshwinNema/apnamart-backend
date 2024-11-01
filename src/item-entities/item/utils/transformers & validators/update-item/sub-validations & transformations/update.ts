import { BadRequestException, NotFoundException } from '@nestjs/common';

export const validateUpdateFilters = (
  updateFilters,
  filterMap,
  mainFilterDetails,
) => {
  const { idMap, nameToIdMap, productOptionsMap } = filterMap;
  updateFilters?.forEach((filter, index) => {
    const {
      id,
      name,
      createOptions,
      updateOptions,
      deleteOptions,
      isMainFilter,
    } = filter;
    if (isMainFilter) {
      mainFilterDetails.updatedMainFilter = filter;
    }
    if (mainFilterDetails?.prevMainFilter?.id === id) {
      mainFilterDetails.curPrevFilter = filter;
      mainFilterDetails.curPrevFilterIndex = index;
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
      if (productOptionsMap[deleteId]) {
        throw new BadRequestException(
          `Options cannot be deleted because they are attached with products`,
        );
      }
    });
  });
};
