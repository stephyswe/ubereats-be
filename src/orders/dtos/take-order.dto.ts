import { InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '../../common/dtos/output.dto';
import { Order } from '../models/order.model';

@InputType()
export class TakeOrderInput extends PickType(Order, ['id']) {}

@ObjectType()
export class TakeOrderOutput extends CoreOutput {}