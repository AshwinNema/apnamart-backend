import { Module } from '@nestjs/common';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from './customer/customer.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UploaderModule } from 'src/uploader/uploader.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserAddressService } from './user/user-address.service';
import { MerchantModule } from './merchant/merchant.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    NestjsFormDataModule,
    UploaderModule,
    MerchantModule,
    RouterModule.register([
      {
        path: 'merchant',
        module: MerchantModule,
      },
    ]),
  ],
  providers: [AdminService, CustomerService, UserService, UserAddressService],
  controllers: [AdminController, CustomerController, UserController],
  exports: [AdminService, CustomerService, UserService],
})
export class UserEntitesModule {}
