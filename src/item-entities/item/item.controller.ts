import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { SkipAccessAuth } from 'src/auth/jwt/access.jwt';
import { CommonService } from 'src/common/common.service';
import {
  CreateItemValidation,
  CreateItemValidator,
  QueryItems,
  SearchByName,
  UpdateItem,
  ItemFileUpload,
} from 'src/validations';
import {
  DeleteItemValidatorPipe,
  getQueryItemArgs,
  UpdateItemValidator,
} from './utils';
import { Roles } from 'src/auth/role/role.guard';
import { UserRole } from '@prisma/client';
import { RequestProcessor } from 'src/decorators';
import { FormDataRequest } from 'nestjs-form-data';
import { MultiPartDataPipe } from 'src/pipes';
import {
  ValidateAndTransformCreateDataPipe,
  UpdateItemPayloadTransformPipe,
} from './utils';

@Controller()
export class ItemController {
  constructor(
    private itemService: ItemService,
    private commonService: CommonService,
  ) {}

  @Get()
  @SkipAccessAuth()
  async getItems(@Query() query: QueryItems) {
    return this.commonService.queryData(...getQueryItemArgs(query));
  }

  @Post()
  @Roles(UserRole.admin)
  @UsePipes(new ValidateAndTransformCreateDataPipe())
  @UsePipes(new MultiPartDataPipe(CreateItemValidator))
  @FormDataRequest()
  createItems(
    @Body() _: CreateItemValidation,
    @RequestProcessor() processedRequest,
  ) {
    const {
      body: { file, data },
    } = processedRequest;
    return this.itemService.createItem(data, file);
  }

  @Put('image/:id')
  @Roles(UserRole.admin)
  @FormDataRequest()
  updateItemFilter(
    @Body() body: ItemFileUpload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.itemService.updateItemImg(id, body.file);
  }

  @Get('search-by-name')
  async nameList(@Query() query: SearchByName) {
    return this.itemService.searchByName(query.name);
  }

  @Put(':id')
  @UsePipes(new UpdateItemPayloadTransformPipe())
  @UsePipes(new UpdateItemValidator())
  @Roles(UserRole.admin)
  updateItemById(
    @Param('id', ParseIntPipe) id: number,
    @Body() _: UpdateItem,
    @RequestProcessor() { body },
  ) {
    return this.itemService.updateItemById(id, body);
  }
  @Delete(':id')
  @UsePipes(new DeleteItemValidatorPipe())
  @Roles(UserRole.admin)
  async deleteItemById(@Param('id', ParseIntPipe) id: number) {
    await this.itemService.deleteItem(id);
    return { success: true };
  }
}
