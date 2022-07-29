import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreInputId } from '../../common/dtos/output.dto';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { User } from '../../users/models/user.model';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
export class Payment extends CoreInputId {
  @Field(() => String)
  transactionId: string;

  @Field(() => User)
  user: User;

  @Field(() => Restaurant)
  restaurant: Restaurant;

  @Field(() => Int)
  restaurantId: number;
}
