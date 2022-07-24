import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { CreateRestaurantInputArgs } from './create-restaurant.dto';

@InputType()
export class UpdateRestaurantInputArgs extends PartialType(
  CreateRestaurantInputArgs,
) {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class UpdateRestaurantOutput extends CoreOutput {}
