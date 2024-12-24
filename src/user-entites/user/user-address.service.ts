import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserInterface } from 'src/interfaces';
import { DeliveryAreaService } from 'src/orders-entities/delivery-area/delivery-area.service';
import prisma from 'src/prisma/client';
import { axiosMethods, makeAxiosConfig } from 'src/utils';
import endpoints from 'src/utils/endpoints';
import { UpdateUserAddress } from 'src/validations';

@Injectable()
export class UserAddressService {
  ola_api_key: string;
  constructor(
    private configService: ConfigService,
    private deliverySerivce: DeliveryAreaService,
  ) {
    this.ola_api_key = this.configService.get('ola_maps').api_key;
  }
  async queryLocations(input: string) {
    const config = makeAxiosConfig(
      axiosMethods.get,
      endpoints.ola_query_location,
      { api_key: this.ola_api_key, input },
      null,
    );

    const data = await axios(config);

    return data.data;
  }

  async getAddress(lat: number, lng: number) {
    const config = makeAxiosConfig(
      axiosMethods.get,
      endpoints.ola_get_address,
      { api_key: this.ola_api_key },
      null,
    );
    config.url += `&latlng=${lat},${lng}`;
    const data = await axios(config);

    return data.data;
  }

  async updateUserAddress(update: UpdateUserAddress, user: UserInterface) {
    const isDeliverable =
      await this.deliverySerivce.checkIsAreaDeliverable(update);
    if (!isDeliverable) {
      throw new BadRequestException('Your area is not deliverable');
    }

    return prisma.userAddress.upsert({
      where: { userId: user.id },
      update,
      create: { ...update, userId: user.id },
    });
  }
}
