import { Module } from '@nestjs/common';
import { DeliveryAreaController } from './delivery-area/delivery-area.controller';
import { DeliveryAreaService } from './delivery-area/delivery-area.service';
import { CheckoutService } from './checkout/checkout.service';
import { CheckoutController } from './checkout/checkout.controller';
import { Checkout2Service } from './checkout/checkout2.service';

@Module({
  imports: [],
  providers: [DeliveryAreaService, CheckoutService, Checkout2Service],
  controllers: [DeliveryAreaController, CheckoutController],
  exports: [],
})
export class OrdersEntitiesModule {}
