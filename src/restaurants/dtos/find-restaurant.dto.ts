import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { Restaurant } from '../models/restaurant.model';
import { CoreOutput } from './../../common/dtos/output.dto';

@InputType()
export class RestaurantInput {
  @Field(() => Int)
  restaurantId: number;
}

@ObjectType()
export class RestaurantOutput extends CoreOutput {
  @Field(() => Restaurant, { nullable: true })
  results?: Restaurant;
}
