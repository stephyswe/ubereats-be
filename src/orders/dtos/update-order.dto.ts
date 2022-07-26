import { InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '../../common/dtos/output.dto';
import { Order } from '../models/order.model';

@InputType()
export class UpdateOrderInput extends PickType(Order, ['id', 'status']) {}

@ObjectType()
export class UpdateOrderOutput extends CoreOutput {}
