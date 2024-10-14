import { Body, Controller, Get, Put, Query, UsePipes } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { blockUnblockMerchant, QueryMerchants } from 'src/validations';
import { Roles } from 'src/auth/role/role.guard';
import { UserRole } from '@prisma/client';
import { ValidateMerchantToBlock } from './utils';
import { RequestProcessor } from 'src/decorators';
import { MerchantRegistration2Service } from './merchant-registration/merchant-registration2.service';

@Controller()
export class MerchantController {
  constructor(
    private merchantService: MerchantService,
    private merchantRegistrationService: MerchantRegistration2Service,
  ) {}

  @Roles(UserRole.admin)
  @Get()
  queryMerchants(@Query() query: QueryMerchants) {
    return this.merchantService.queryMerchants(query);
  }

  @UsePipes(new ValidateMerchantToBlock())
  @Roles(UserRole.admin)
  @Put('block-unblock')
  blockUnbloickMerchant(
    @RequestProcessor() req,
  ) {
    return this.merchantRegistrationService.banremoveBanMerchat(req.body);
  }
}
