import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CommonLoginUserResponse {
  @ApiProperty({
    description: 'Id of the user',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Roles assigned to the user',
    type: [UserRole],
    enum: UserRole,
    example: [UserRole.admin],
    enumName: 'UserRole',
  })
  userRoles: UserRole[];

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Role of the user',
    example: UserRole.admin,
    type: String,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '8989445656',
    type: String,
    nullable: true,
  })
  phoneNo: string | null;

  @ApiProperty({
    description: 'Photo URL of the user',
    example:
      'https://res.cloudinary.com/ash006/image/upload/v1730952890/ghhrbyl6etjijcjc0wpt.png',
    type: String,
    nullable: true,
  })
  photo: string | null;

  @ApiProperty({
    description: 'Cloudinary public ID for the user photo',
    example: 'ghhrbyl6etjijcjc0wpt',
    type: String,
    nullable: true,
  })
  cloudinary_public_id: string | null;

  @ApiProperty({
    description: 'Indicates if the user is blacklisted',
    example: false,
    type: Boolean,
  })
  isBlackListed: boolean;

  @ApiProperty({
    description: 'Indicates if the user is archived',
    example: false,
    type: Boolean,
  })
  archive: boolean;
}
