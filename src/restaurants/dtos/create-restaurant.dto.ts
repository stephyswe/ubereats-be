import { ArgsType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../model/restaurant.model';

@ArgsType()
export class CreateRestaurantDto extends OmitType(Restaurant, ['id']) {}
