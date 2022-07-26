import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '../../common/dtos/output.dto';
import { Order, OrderStatus } from '../models/order.model';

@InputType()
export class FindManyOrdersInput {
  @Field(() => OrderStatus, { nullable: true })
  status?: OrderStatus;
}

@ObjectType()
export class FindManyOrdersOutput extends CoreOutput {
  @Field(() => [Order], { nullable: true })
  orders?: Order[];
}
