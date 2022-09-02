import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Dish } from '../models/dish.model';

import { CoreOutput } from './../../common/dtos/output.dto';

@InputType()
export class findManyDishesIdsInput {
  @Field(() => [Int])
  dishIds: number[];
}

@ObjectType()
export class findManyDishesIdsOutput extends CoreOutput {
  @Field(() => [Dish])
  results?: Dish[];
}
