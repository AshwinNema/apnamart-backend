import * as _ from 'lodash';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { UserInterface } from 'src/interfaces';
import { UpdateItem } from 'src/validations';
import { z } from 'zod';
export class UpdateItemPayloadTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') return value;

    const body: UpdateItem = value.body;
    const mainDetails = _.pick(body, ['name', 'categoryId', 'subCategoryId']);
    const itemId = z.coerce
      .number({ message: 'Item id must be a number' })
      .int({ message: 'Item id must be an integer' })
      .min(1, {
        message: 'Item must be greater than or equal to 1',
      })
      .parse(value.params.id);
    const user: UserInterface = value.user;
    const createdBy = z.coerce.number().min(1).parse(user.id);
    const create =
      body?.newFilters?.map((item) => {
        const { name, options, filterType } = item;
        return {
          name,
          createdBy,
          options: {
            createMany: {
              data: options.map((optionDetails) => ({
                ...optionDetails,
                createdBy,
              })),
            },
          },
          filterType,
        };
      }) || [];

    const update = [];

    body?.updateFilters?.forEach?.((filter) => {
      const { id, createOptions, deleteOptions, updateOptions } = filter;

      const details = _.pick(filter, ['name', 'filterType']);
      const updateOptionList = [];
      updateOptions?.forEach((option) => {
        const { id, name } = option;
        updateOptionList.push({
          where: { id },
          data: { name },
        });
      });

      deleteOptions?.forEach((optionId) => {
        updateOptionList.push({
          where: { id: optionId },
          data: { archive: true },
        });
      });

      const createList =
        createOptions?.map((item) => {
          return {
            name: item.name,
            createdBy,
          };
        }) || [];

      update.push({
        where: {
          id,
        },
        data: {
          ...details,
          options: {
            update: updateOptionList,
            createMany: {
              data: createList,
            },
          },
        },
      });
    });

    value.body = {
      update: {
        where: { id: itemId },
        data: {
          ...mainDetails,
          filters: {
            create,
            update,
          },
        },
      },
      deleteFilters: body.deleteFilters,
    };
    return value;
  }
}
