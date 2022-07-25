import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Restaurant } from '../models/restaurant.model';
import {
  PaginationInput,
  PaginationOutput,
} from './../../common/dtos/pagination.dto';

@InputType()
export class RestaurantsInput extends PaginationInput {}

@ObjectType()
export class RestaurantsOutput extends PaginationOutput {
  @Field(() => [Restaurant], { nullable: true })
  results?: Restaurant[];
}
