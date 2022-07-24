import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Restaurant } from '../models/restaurant.model';
import {
  PaginationInput,
  PaginationOutput,
} from './../../common/dtos/pagination.dto';

@InputType()
export class RestaurantInput extends PaginationInput {
  /*   @Field(() => Int)
    restaurantId: number; */
}

@ObjectType()
export class RestaurantOutput extends PaginationOutput {
  @Field(() => [Restaurant], { nullable: true })
  results?: Restaurant[];
}
