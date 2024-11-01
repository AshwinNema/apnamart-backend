import { BadRequestException } from '@nestjs/common';

export const validateOptionsAndGetFilterQuery = (
  itemData,
  productDetails,
  options,
  itemId,
) => {
  const filterOptionQuery: {
    filterOptions: {
      connect?: { id: number }[];
      disconnect?: { id: number }[];
    };
  } = {
    filterOptions: {},
  };

  if (!options) return filterOptionQuery;

  const productOptionMap = itemData.filters.reduce(
    (optionMap, filterDetails) => {
      filterDetails.options.forEach((optionDetails) => {
        optionMap[optionDetails.id] = filterDetails.id;
      });
      return optionMap;
    },
    {},
  );

  const duplicateOptionChecker = {};
  options.forEach((optionId) => {
    const filterId = productOptionMap[optionId];
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
  const isSameItem = itemId && productDetails.itemId != itemId;
  if (!isSameItem) {
    filterOptionQuery.filterOptions.disconnect =
      productDetails.filterOptions.map((optionDetails) => {
        return { id: optionDetails.id };
      });
    filterOptionQuery.filterOptions.connect = options.map((optionId) => ({
      id: optionId,
    }));
  }

  if (isSameItem) {
    const newOptionMap = options.reduce((optionMap, optionId) => {
      optionMap[optionId] = true;
      return optionMap;
    }, {});

    const { productOptionMap, disconnectList } =
      productDetails.filterOptions.reduce(
        ({ productOptionMap, disconnectList }, option) => {
          productOptionMap[option.id] = option.filterId;
          if (!newOptionMap[option.id]) {
            disconnectList.push(option.id);
          }
          return { productOptionMap, disconnectList };
        },
        { productOptionMap: {}, disconnectList: [] },
      );

    const connectList = options.reduce((list, optionId) => {
      if (!productOptionMap[optionId]) {
        list.push(optionId);
      }
      return list;
    }, []);

    filterOptionQuery.filterOptions = {
      connect: connectList.map((optionId) => ({ id: optionId })),
      disconnect: disconnectList.map((optionId) => ({ id: optionId })),
    };
  }
  return filterOptionQuery;
};
