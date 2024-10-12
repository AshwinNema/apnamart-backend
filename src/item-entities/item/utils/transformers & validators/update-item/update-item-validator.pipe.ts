import {
  ArgumentMetadata,
  BadRequestException,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import prisma from 'src/prisma/client';
import {
  validateDeleteFilters,
  validateNewFilters,
  validateUpdateFilters,
} from './sub-validations';
import { getFilterMap, getPrismaQuery } from './data-transformers';

// Please Note: We only check here the data for which we need to check it through the database. The remaining checks are handled through class validators.This is the validation for items, there are following dependency checks:
// 1. Duplicate name check - No other item with the same subcategory should have the same name
// 2. If subcategory id is being updated, then we check that sub category should be present in the system
// 3. For new filters we check that are there any filters with the same name already present in the system
// 4. for updating filters we check foolowing:
//    4.1.filter should be present in the system,
//    4.2.if we are trying to update name of the filter then there should not be any other filter with the same name
//    4.3.options that we are creating for that filter should have a different name from the options already present in the system,
//    4.4.if we are updating options then the option should be present in the system and no other option in the filter should have the same name as that option
//    4.5.for deleting filter options we check that that option should be present in the system and it should not be attached with any product
// 5. While deleting filters we chck that that filter should be present in the system

export class UpdateItemValidator implements PipeTransform {
  async transform(value, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') return value;
    const { body } = value;
    let {
      params: { id },
    } = value;
    id = parseInt(id);

    const data = await prisma.item.findUnique(getPrismaQuery(id));

    if (!data) {
      throw new NotFoundException('Item not found');
    }
    const updatedSubCategoryId = body.subCategoryId || data.subCategoryId;
    if (
      body.name &&
      data.name !== body.name &&
      (await prisma.item.findFirst({
        where: {
          id: { not: id },
          name: body.name,
          subCategoryId: updatedSubCategoryId,
        },
      }))
    ) {
      throw new BadRequestException(
        'Item with the same name is already present in the system',
      );
    }

    if (
      body.subCategoryId &&
      data.subCategoryId != updatedSubCategoryId &&
      !(await prisma.subCategory.findFirst({
        where: {
          id: updatedSubCategoryId,
        },
      }))
    ) {
      throw new BadRequestException('Sub category not found');
    }

    const filterMap = getFilterMap(data);
    validateNewFilters(body?.newFilters, filterMap.nameToIdMap);
    validateUpdateFilters(body?.updateFilters, filterMap);
    validateDeleteFilters(body?.deleteFilters, filterMap.idMap);

    return value;
  }
}
