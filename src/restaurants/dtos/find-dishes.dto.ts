import { Field, ObjectType } from '@nestjs/graphql';

import { Dish } from '../models/dish.model';
import { CoreOutput } from './../../common/dtos/output.dto';

@ObjectType()
export class FindManyDishesOutput extends CoreOutput {
  @Field(() => [Dish], { nullable: true })
  menu?: Dish[];
}
