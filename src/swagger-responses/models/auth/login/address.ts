import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '@prisma/client';

export class LoginAddress {
  @ApiProperty({
    description: 'Id of the address',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Id of the user associated with the address',
    example: 3,
    type: Number,
  })
  userId: number;

  @ApiProperty({
    description: 'Latitude of the address location',
    example: '24.6079710847333',
    type: String,
  })
  latitude: string;

  @ApiProperty({
    description: 'Longitude of the address location',
    example: '76.50963025910778',
    type: String,
  })
  longtitude: string;

  @ApiProperty({
    description: 'Type of the address',
    example: AddressType.home,
    type: String,
    enum: AddressType,
  })
  addressType: AddressType;

  @ApiProperty({
    description: 'First line of the address',
    example: '401,',
    type: String,
  })
  addressLine1: string;

  @ApiProperty({
    description: 'Second line of the address',
    example: 'D.K. Gold Apartment',
    type: String,
  })
  addressLine2: string;

  @ApiProperty({
    description: 'Any additional address information',
    example: '',
    type: String,
  })
  otherAddress: string;

  @ApiProperty({
    description: 'Timestamp when the address was created',
    example: '2024-12-07T11:07:56.318Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when the address was last updated',
    example: '2024-12-08T09:06:50.674Z',
    type: String,
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Indicates if the address is archived',
    example: false,
    type: Boolean,
  })
  archive: boolean;
}
