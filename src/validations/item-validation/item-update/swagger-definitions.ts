import { ItemFilterType } from '@prisma/client';
import { updateFilter } from './sub-validations';
import { ApiPropertyOptions } from '@nestjs/swagger';
import { CreateFilterValidation } from '../filter-subvalidations';

export const updateFiltersDefinition: ApiPropertyOptions = {
  description: 'Filters to be updated',
  type: [updateFilter],
  example: [
    {
      id: 1,
      name: 'RAM',
      createOptions: [{ name: '2 GB' }, { name: '5 GB' }],
      deleteOptions: [1, 2],
      filterType: ItemFilterType.normal,
      updateOptions: [
        { id: 1, name: '1 GB' },
        { id: 2, name: '4 GB' },
      ],
    },
  ],
  required: false,
};

export const newFiltersDefinition: ApiPropertyOptions = {
  description: 'New filters to be added',
  type: [CreateFilterValidation],
  example: [
    {
      name: 'Brand',
      options: [{ name: 'Redmi' }, { name: 'Apple' }],
      filterType: ItemFilterType.normal,
    },
  ],
  required: false,
};
