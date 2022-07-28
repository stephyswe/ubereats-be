import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';
import { CoreInputId } from '../../common/dtos/output.dto';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { User } from '../../users/models/user.model';

import { OrderItem } from './order-item.model';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  Cooked = 'Cooked',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
export class Order extends CoreInputId {
  @Field(() => User, { nullable: true })
  customer?: User;

  @Field(() => User, { nullable: true })
  driver?: User;

  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;

  @Field(() => [OrderItem])
  items?: OrderItem[];

  @Field(() => Float, { nullable: true })
  @IsNumber()
  total?: number;

  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status?: OrderStatus;
  driverId: number;
}
