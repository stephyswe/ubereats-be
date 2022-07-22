import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { CreateRestaurantInputType } from './create-restaurant.dto';

@InputType()
class UpdateRestaurantInputType extends PartialType(
  CreateRestaurantInputType,
) {}

@InputType()
class RestaurantUpdateInput {
  @Field()
  id: number;
}

@InputType()
export class UpdateRestaurantInput {
  @Field(() => RestaurantUpdateInput)
  where: Prisma.RestaurantWhereUniqueInput;

  @Field(() => UpdateRestaurantInputType)
  data: Prisma.RestaurantUpdateInput;
}
