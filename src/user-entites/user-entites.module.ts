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
import { ProductService } from 'src/item-entities/product/product.service';
import { Product2Service } from 'src/item-entities/product/product2.service';
import { CommonService } from 'src/common/common.service';
import { CustomerCartService } from './customer/customer-cart.service';
import { DeliveryAreaService } from 'src/orders-entities/delivery-area/delivery-area.service';
import { CustomerOrderService } from './customer/customer-order/customer-order.service';

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
  providers: [
    AdminService,
    CustomerService,
    UserService,
    UserAddressService,
    ProductService,
    Product2Service,
    CommonService,
    CustomerCartService,
    DeliveryAreaService,
    CustomerOrderService,
  ],
  controllers: [AdminController, CustomerController, UserController],
  exports: [AdminService, CustomerService, UserService],
})
export class UserEntitesModule {}
