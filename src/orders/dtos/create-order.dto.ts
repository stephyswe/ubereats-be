import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '../../common/dtos/output.dto';
import { OrderItemOption } from '../models/order-item.model';

@InputType()
class CreateOrderItemInput {
  @Field(() => Int)
  dishId: number;

  @Field(() => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[] | string | [];
}

@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  restaurantId: number;

  @Field(() => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}
