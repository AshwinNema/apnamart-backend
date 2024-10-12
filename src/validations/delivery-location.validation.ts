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

export class DeliveryAreaValidation extends LatLng {
  @Min(1000, { message: 'Area must be atleast 1 km in radius' })
  @IsNumber()
  radius: number;
}

export class UpdateAreaValidation extends DeliveryAreaValidation {
  @Min(1)
  @IsInt()
  id: number;
}

export class UpdateMapState {
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => DeliveryAreaValidation)
  created: DeliveryAreaValidation[];

  @ArrayUnique((area) => area.id)
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UpdateAreaValidation)
  update: UpdateAreaValidation[];

  @ArrayUnique((id) => id)
  @Min(1, { each: true })
  @IsInt({ each: true })
  @IsArray()
  deleted: number[];
}
