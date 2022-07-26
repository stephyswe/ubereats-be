import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Order } from '../models/order.model';

@InputType()
export class FindOrderInput extends PickType(Order, ['id']) {}

@ObjectType()
export class FindOrderOutput extends CoreOutput {
  @Field(() => Order, { nullable: true })
  order?: Order;
}
