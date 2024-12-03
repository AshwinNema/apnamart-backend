import { ItemFilterType } from '@prisma/client';

export const getPrismaQuery = (id: number) => {
  return {
    where: { id },
    include: {
      filters: {
        where: {
          archive: false,
        },
        include: {
          options: {
            where: {
              archive: false,
            },
          },
        },
      },
      product: {
        where: { archive: false },
        include: {
          filterOptions: {
            where: { archive: false },
            select: {
              id: true,
            },
          },
        },
      },
    },
  };
};

export const getFilterMaps = (data) => {
  const {
    idMap,
    nameToIdMap,
    differentFilterTypeToIdMap,
    filterIdToFilterTypeMap,
  } = data.filters.reduce(
    (map, filter) => {
      const {
        idMap,
        nameToIdMap,
        differentFilterTypeToIdMap,
        filterIdToFilterTypeMap,
      } = map;
      const { id, name, filterType } = filter;
      nameToIdMap[name] = id;
      if (filterType !== ItemFilterType.normal) {
        differentFilterTypeToIdMap[filterType] = id;
        filterIdToFilterTypeMap[id] = filterType;
      }
      idMap[id] = filter.options.reduce(
        (map, option) => {
          const { optionIdMap, optionNameToIdMap } = map;
          const { id, name } = option;
          optionIdMap[id] = name;
          optionNameToIdMap[name] = id;
          return map;
        },
        { optionIdMap: {}, optionNameToIdMap: {} },
      );
      return map;
    },
    {
      idMap: {},
      nameToIdMap: {},
      differentFilterTypeToIdMap: {},
      filterIdToFilterTypeMap: {},
    },
  );

  const productOptionsMap = data.product.reduce((obj, item) => {
    item.filterOptions.forEach((option) => {
      obj[option.id] = true;
    });

    return obj;
  }, {});
  return {
    idMap,
    nameToIdMap,
    productOptionsMap,
    differentFilterTypeToIdMap,
    filterIdToFilterTypeMap,
  };
};
