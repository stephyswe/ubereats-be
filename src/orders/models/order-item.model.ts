import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Dish } from '../../restaurants/models/dish.model';
import { CoreInputId } from './../../common/dtos/output.dto';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  choice?: string;
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
export class OrderItem extends CoreInputId {
  @Field(() => Dish)
  dish: Dish;

  @Field(() => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}
