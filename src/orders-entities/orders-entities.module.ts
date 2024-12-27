import { Module } from '@nestjs/common';
import { DeliveryAreaController } from './delivery-area/delivery-area.controller';
import { DeliveryAreaService } from './delivery-area/delivery-area.service';
import { CheckoutModule } from './checkout/checkout.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    CheckoutModule,
    RouterModule.register([
      {
        path: 'checkout',
        module: CheckoutModule,
      },
    ]),
  ],
  providers: [DeliveryAreaService],
  controllers: [DeliveryAreaController],
  exports: [],
})
export class OrdersEntitiesModule {}
