import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { DeliveryAreaService } from './delivery-area.service';
import { LatLng, UpdateMapState } from 'src/validations';
import { User } from 'src/decorators';
import { Roles } from 'src/auth/role/role.guard';
import { UserRole } from '@prisma/client';

@Controller('delivery-area')
export class DeliveryAreaController {
  constructor(private deliveryAreaService: DeliveryAreaService) {}

  @Get()
  @Roles(UserRole.admin)
  getAllDeliveryAreas() {
    return this.deliveryAreaService.findAllDeliveryAreas();
  }

  @Put()
  @Roles(UserRole.admin)
  updateDeliveryAreas(@Body() body: UpdateMapState, @User() user) {
    return this.deliveryAreaService.updateDeliveryAreas(body, user);
  }

  @Get('is-area-deliverable')
  @Roles(UserRole.customer)
  async checkIsAreaDeliveryAble(@Query() query: LatLng) {
    const isAreaDeliverable =
      await this.deliveryAreaService.checkIsAreaDeliverable(query);
    return { isAreaDeliverable };
  }
}
