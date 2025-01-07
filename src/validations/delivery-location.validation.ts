import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { LatLng } from './common.validation';
import { ApiProperty } from '@nestjs/swagger';

export class DeliveryAreaValidation extends LatLng {
  @ApiProperty({
    description: 'Radius of the delivery area in meters',
    example: 1500,
  })
  @Min(1000, { message: 'Area must be atleast 1 km in radius' })
  @IsNumber()
  radius: number;
}

export class UpdateAreaValidation extends DeliveryAreaValidation {
  @ApiProperty({
    description: 'Id of the delivery area',
    example: 1,
  })
  @Min(1)
  @IsInt()
  id: number;
}

export class UpdateMapState {
  @ApiProperty({
    type: [DeliveryAreaValidation],
    description: 'List of new delivery areas to be created',
    example: [{ radius: 1500 }],
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => DeliveryAreaValidation)
  created: DeliveryAreaValidation[];

  @ApiProperty({
    type: [UpdateAreaValidation],
    description: 'List of delivery areas to be updated',
    example: [{ id: 1, radius: 2000 }],
  })
  @ArrayUnique((area) => area.id)
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UpdateAreaValidation)
  update: UpdateAreaValidation[];

  @ApiProperty({
    type: [Number],
    description: 'List of delivery area IDs to be deleted',
    example: [1, 2, 3],
  })
  @ArrayUnique((id) => id)
  @Min(1, { each: true })
  @IsInt({ each: true })
  @IsArray()
  deleted: number[];
}
