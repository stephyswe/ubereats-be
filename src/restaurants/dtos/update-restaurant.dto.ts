import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { CoreOutput } from '../../common/dtos/output.dto';
import { CreateRestaurantInputArgs } from './create-restaurant.dto';

@InputType()
export class UpdateRestaurantInputArgs extends PartialType(
  CreateRestaurantInputArgs,
) {
  @Field(() => Number)
  restaurantId: number;
}

@InputType()
class UpdateInRestaurantId {
  @Field()
  id: number;
}

@InputType()
export class UpdateRestaurantInput {
  @Field(() => UpdateInRestaurantId)
  where: Prisma.RestaurantWhereUniqueInput;

  @Field(() => UpdateRestaurantInputArgs)
  data: Prisma.RestaurantUpdateInput;
}

@ObjectType()
export class UpdateRestaurantOutput extends CoreOutput {}
