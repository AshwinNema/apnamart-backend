import { BadRequestException, NotFoundException } from '@nestjs/common';

export * from './update';

export const validateNewFilters = (
  newFilters,
  nameToIdMap,
  mainFilterDetails,
) => {
  newFilters?.forEach?.((filter) => {
    const { name, isMainFilter } = filter;
    if (isMainFilter) {
      mainFilterDetails.updatedMainFilter = filter;
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
    if (filterId === mainFilterDetails?.prevMainFilter?.id) {
      mainFilterDetails.isPrevMainFilterDeleted = true;
    }
    if (!filterDetails) {
      throw new NotFoundException('Filter not found');
    }
  });
};

//1.If curMainFilter is deleted then there should be a new main filter
//2.If curMainFilter is unassigned but no new main filter is assigned, then it is an issue because there is no main filter
export const validateMainFilters = (mainFilterDetails) => {
  if (
    mainFilterDetails.isPrevMainFilterDeleted &&
    !mainFilterDetails.updatedMainFilter
  ) {
    throw new BadRequestException(
      'Current main filter cannot be deleted without assigning a new main filter',
    );
  }

  if (
    !mainFilterDetails.updatedMainFilter &&
    !mainFilterDetails?.curPrevFilter?.isMainFilter &&
    typeof mainFilterDetails?.curPrevFilter?.isMainFilter === 'boolean'
  ) {
    throw new BadRequestException(
      'Main filter has to be reassigned if it is removed from the current main filter',
    );
  }
};

// Function to clear prev filter from being main filter if a new main filter is assigned
// 1.If prev filter is deleted then there is no issue for main filter
// 2.If there is no updated main filter then there is no need to check for anything

export const clearPrevMainFilter = (value, mainFilterDetails) => {
  if (mainFilterDetails.isPrevMainFilterDeleted) return;
  if (!mainFilterDetails.updatedMainFilter) return;
  if (
    mainFilterDetails?.updatedMainFilter?.id ===
    mainFilterDetails?.prevMainFilter?.id
  )
    return;
  if (
    typeof mainFilterDetails?.curPrevFilter?.isMainFilter === 'boolean' &&
    !mainFilterDetails?.curPrevFilter?.isMainFilter
  )
    return;
  if (mainFilterDetails?.curPrevFilterIndex != null) {
    value.body.updateFilters[
      mainFilterDetails?.curPrevFilterIndex
    ].isMainFilter = false;
    return;
  }
  mainFilterDetails?.prevMainFilter &&
    value.body.updateFilters.push({
      id: mainFilterDetails?.prevMainFilter.id,
      isMainFilter: false,
    });
};
