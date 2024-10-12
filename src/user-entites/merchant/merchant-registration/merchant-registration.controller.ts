import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { MerchantRegistrationStatus, UserRole } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';
import { Roles } from 'src/auth/role/role.guard';
import { RequestProcessor, User } from 'src/decorators';
import { MultiPartDataPipe } from 'src/pipes';
import {
  CreateMerchantRegistration,
  MerchantRegistrationDetails,
  MerchantRegistrationFile,
  QueryMerchantRegistrations,
} from 'src/validations';
import { MerchantRegistrationService } from './/merchant-registration.service';
import { ValidateAndTransformCreateRegistrationPipe } from '../utils';
import { MerchantRegistration2Service } from './merchant-registration2.service';

@Controller('registration')
export class MerchantRegistrationController {
  constructor(
    private merchantRegistrationService: MerchantRegistrationService,
    private merchantRegistrationService2: MerchantRegistration2Service,
  ) {}

  @Post()
  @UsePipes(new ValidateAndTransformCreateRegistrationPipe())
  @UsePipes(new MultiPartDataPipe(MerchantRegistrationDetails))
  @FormDataRequest()
  @Roles(UserRole.merchant)
  register(
    @Body() _: CreateMerchantRegistration,
    @RequestProcessor() procesedRequest,
  ) {
    const {
      body: { file, data },
    } = procesedRequest;

    return this.merchantRegistrationService.createRegistration(data, file);
  }

  @Put('/image')
  @Roles(UserRole.merchant)
  @FormDataRequest()
  updateMerchantLogo(@Body() body: MerchantRegistrationFile, @User() user) {
    return this.merchantRegistrationService.updateRegistrationImg(
      user.id,
      body.file,
    );
  }

  @Put()
  @Roles(UserRole.merchant)
  updateMerchantDetails(
    @Body() body: MerchantRegistrationDetails,
    @User() user,
  ) {
    return this.merchantRegistrationService.updateMerchantRegistration(
      user.id,
      body,
      {
        registrationStatus: { not: MerchantRegistrationStatus.review_by_admin },
      },
      'Details cannot be updated when details are being edited by the admin',
    );
  }

  @Get()
  @Roles(UserRole.admin)
  async queryMerchantRegistrations(@Query() query: QueryMerchantRegistrations) {
    return this.merchantRegistrationService2.queryRegistrations(query);
  }

  @Put('approve/:id')
  @Roles(UserRole.admin)
  approveRegistration(@Param('id', ParseIntPipe) id: number) {
    return this.merchantRegistrationService2.approveMerchantRegistration(id);
  }
}
