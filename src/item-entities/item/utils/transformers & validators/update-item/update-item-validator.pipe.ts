import {
  ArgumentMetadata,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import prisma from 'src/prisma/client';
import {
  clearPrevMainFilter,
  validateDeleteFilters,
  validateMainFilters,
  validateNewFilters,
  validateUpdatedCatSubCat,
  validateUpdateFilters,
} from './sub-validations & transformations';
import {
  getFilterMapsAndMainFilter,
  getPrismaQuery,
} from './data-transformers';
import { UpdateItem } from 'src/validations';

// Please Note: We only check here the data for which we need to check it through the database. The remaining checks are handled through class validators.This is the validation for items, there are following dependency checks:
// 1. Duplicate name check - No other item with the same category should have the same name
// 2. If category id is being updated, then we check that sub category should be present in the system
// 3. For new filters we check that are there any filters with the same name already present in the system
// 4. for updating filters we check foolowing:
//    4.1.filter should be present in the system,
//    4.2.if we are trying to update name of the filter then there should not be any other filter with the same name
//    4.3.options that we are creating for that filter should have a different name from the options already present in the system,
//    4.4.if we are updating options then the option should be present in the system and no other option in the filter should have the same name as that option
//    4.5.for deleting filter options we check that that option should be present in the system and it should not be attached with any product
// 5. While deleting filters we chck that that filter should be present in the system
// 6. There can only be one main filter for an item, hence we check that during update if the id of the main filter is not equal to new id of the main filter, if they are not equal and our prev filter id is not deleted and prev filter is not present in updated filters, then new main filter is wrong , prev one should be removed first

export class UpdateItemValidator implements PipeTransform {
  async transform(value, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') return value;
    const body: UpdateItem = value.body;
    let {
      params: { id },
    } = value;
    id = parseInt(id);

    const data = await prisma.item.findUnique(getPrismaQuery(id));
    if (!data) {
      throw new NotFoundException('Item not found');
    }
    await validateUpdatedCatSubCat(body, id, data);
    // const newFilterCount =
    //   data.filters.length +
    //   (body?.newFilters?.length || 0) -
    //   (body?.deleteFilters?.length || 0);

    // if (newFilterCount === 0)
    //   throw new BadRequestException(
    //     'There has to be atleast one filter in the item',
    //   );
    const filterMapsAndMainFilter = getFilterMapsAndMainFilter(data);
    const mainFilterDetails = {
      updatedMainFilter: null,
      prevMainFilter: filterMapsAndMainFilter.mainFilter,
      isPrevMainFilterDeleted: false,
      curPrevFilter: null,
      curPrevFilterIndex: null,
    };
    validateNewFilters(
      body?.newFilters,
      filterMapsAndMainFilter.nameToIdMap,
      mainFilterDetails,
    );
    validateUpdateFilters(
      body?.updateFilters,
      filterMapsAndMainFilter,
      mainFilterDetails,
    );
    validateDeleteFilters(
      body?.deleteFilters,
      filterMapsAndMainFilter.idMap,
      mainFilterDetails,
    );

    validateMainFilters(mainFilterDetails);
    clearPrevMainFilter(value, mainFilterDetails);
    return value;
  }
}
