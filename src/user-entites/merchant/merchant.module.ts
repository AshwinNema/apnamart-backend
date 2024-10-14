import { Module } from '@nestjs/common';
import { CommunicationModule } from 'src/communication/communication.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UploaderModule } from 'src/uploader/uploader.module';
import { MerchantRegistrationService } from './merchant-registration/merchant-registration.service';
import { MerchantRegistrationController } from './merchant-registration/merchant-registration.controller';
import { MerchantRegistration2Service } from './merchant-registration/merchant-registration2.service';
import { CommonService } from 'src/common/common.service';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';

@Module({
  imports: [NestjsFormDataModule, UploaderModule, CommunicationModule],
  controllers: [MerchantRegistrationController, MerchantController],
  providers: [ 
    MerchantRegistrationService,
    MerchantRegistration2Service,
    CommonService,
    MerchantService,
  ],
  exports: [MerchantRegistrationService, MerchantRegistration2Service],
})
export class MerchantModule {}
