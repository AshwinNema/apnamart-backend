import { ApiProperty } from '@nestjs/swagger';
import { MerchantRegistrationStatus } from '@prisma/client';

export class LoginMerchantRegistrationDetails {
  @ApiProperty({
    description: 'Unique identifier for the merchant',
    example: 2,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Indicates if the merchant is blocked',
    example: false,
    type: Boolean,
  })
  isMerchantBlocked: boolean;

  @ApiProperty({
    description: 'Registration status of the merchant',
    example: MerchantRegistrationStatus.completed,
    enum: MerchantRegistrationStatus,
  })
  registrationStatus: MerchantRegistrationStatus;

  @ApiProperty({
    description: 'User id associated with the merchant',
    example: 4,
    type: Number,
  })
  userId: number;

  @ApiProperty({
    description: 'Latitude of the merchant location',
    example: '18.51397865227429',
    type: String,
  })
  latitude: string;

  @ApiProperty({
    description: 'Longitude of the merchant location',
    example: '73.8360162863335',
    type: String,
  })
  longtitude: string;

  @ApiProperty({
    description: 'First line of the merchant address',
    example: '456 Market Street',
    type: String,
  })
  addressLine1: string;

  @ApiProperty({
    description: 'Second line of the merchant address (optional)',
    example: 'Building 9, Floor 3',
    type: String,
  })
  addressLine2?: string;

  @ApiProperty({
    description: 'Postal code of the merchant location',
    example: 482002,
    type: Number,
  })
  pinCode: number;

  @ApiProperty({
    description: 'Bank account number of the merchant',
    example: '86969666863',
    type: String,
  })
  bankAcNo: string;

  @ApiProperty({
    description: 'GST Identification Number of the merchant',
    example: '29GGGGG1314R9Z6',
    type: String,
  })
  gstIn: string;

  @ApiProperty({
    description: 'PAN card number of the merchant',
    example: 'BAJPC4350M',
    type: String,
  })
  panCard: string;

  @ApiProperty({
    description: 'URL of the merchant photo',
    example:
      'https://res.cloudinary.com/ash006/image/upload/v1730952890/ghhrbyl6etjijcjc0wpt.png',
    type: String,
  })
  photo: string;

  @ApiProperty({
    description: 'Cloudinary public ID for the merchant photo',
    example: 'ghhrbyl6etjijcjc0wpt',
    type: String,
  })
  cloudinary_public_id: string;

  @ApiProperty({
    description: 'Name of the merchant',
    example: 'Hira Electronics',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Description of the merchant business',
    example: 'Business Description for an Electronics Store...',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'Creation timestamp of the merchant record',
    example: '2024-11-07T04:14:50.763Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last updated timestamp of the merchant record',
    example: '2024-11-07T04:17:49.690Z',
    type: String,
  })
  updatedAt: string;
}
