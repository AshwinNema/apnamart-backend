import { BadRequestException } from '@nestjs/common';
import { ItemFilterType } from '@prisma/client';
import { TransformFnParams } from 'class-transformer';
import { priceFilterOptionsValidation } from '.';

export const priceFilterValidation = (details) => {
  const options =
    details?.options?.reduce((list, details) => {
      if (details?.name) {
        list.push(details?.name);
      }
      return list;
    }, []) || [];
  priceFilterOptionsValidation.parse(options);
};

export const validateFilterType =
  (key?: string, isUpdate?: boolean) =>
  ({ value, obj }: TransformFnParams): PropertyDecorator => {
    const differentFilterTypeToIdMap = {};
    value.forEach((details) => {
      const { filterType } = details;
      const isFilterPresent = !!differentFilterTypeToIdMap[filterType];
      if (filterType !== ItemFilterType.normal && isFilterPresent) {
        throw new BadRequestException(
          'There cannot be more than one filter of the same kind for filters other than normal filters',
        );
      }
      filterType === ItemFilterType.price &&
        !isUpdate &&
        priceFilterValidation(details);
    });
    const otherFilters = obj?.[key];
    if (otherFilters) {
      otherFilters.forEach((details) => {
        const { filterType } = details;
        const isFilterPresent = !!differentFilterTypeToIdMap[filterType];
        if (filterType !== ItemFilterType.normal && isFilterPresent) {
          throw new BadRequestException(
            'There cannot be more than one filter of the same kind for filters other than normal filters',
          );
        }
      });
    }
    return value;
  };

export const validateDuplicatesNames =
  (key: string, fieldKey: string, errMsg: string) =>
  ({ value, obj }: TransformFnParams): PropertyDecorator => {
    const compareObj = obj?.[key];
    if (compareObj) {
      const createNames =
        compareObj?.reduce((obj, item) => {
          obj[item?.[fieldKey]] = true;
          return obj;
        }, {}) || {};
      const duplicateNames = value.filter(
        (item) => !!createNames[item?.[fieldKey]],
      );
      if (duplicateNames?.length) {
        throw new BadRequestException(errMsg);
      }
    }
    return value;
  };

export const validateDeleteIds =
  (key: string, errLabel: string, fieldKey: string = 'id') =>
  ({ value, obj }: TransformFnParams): PropertyDecorator => {
    const compareObj = obj?.[key];
    if (compareObj) {
      const idMap = value.reduce((obj, id) => {
        obj[id] = true;
        return obj;
      }, {});

      compareObj?.forEach?.((item) => {
        const value = item?.[fieldKey];
        if (idMap[value]) {
          throw new BadRequestException(
            `${errLabel} cannot be deleted and updated at the same time`,
          );
        }
      });
    }
    return value;
  };
