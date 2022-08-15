import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Dish } from './../models/dish.model';

@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'price',
  'description',
  'options',
  'photo',
  'type',
]) {
  @Field(() => Int)
  restaurantId: number;
}

@ObjectType()
export class CreateDishOutput extends CoreOutput {
  @Field(() => Dish)
  dish?: Dish;
}
