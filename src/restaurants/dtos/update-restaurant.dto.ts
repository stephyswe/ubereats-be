import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { CreateRestaurantInputArgs } from './create-restaurant.dto';

@InputType()
class UpdateRestaurantInputArgs extends PartialType(
  CreateRestaurantInputArgs,
) {}

@InputType()
class RestaurantUpdateInputId {
  @Field()
  id: number;
}

@InputType()
export class UpdateRestaurantInput {
  @Field(() => RestaurantUpdateInputId)
  where: Prisma.RestaurantWhereUniqueInput;

  @Field(() => UpdateRestaurantInputArgs)
  data: Prisma.RestaurantUpdateInput;
}
