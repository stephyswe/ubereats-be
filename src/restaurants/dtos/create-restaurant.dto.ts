import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class CreateRestaurantInputType {
  @Field(() => String)
  name!: string | undefined;

  @Field(() => String)
  address!: string;

  /*  @Field(() => String)
  categoryName!: string; */
}

@InputType()
export class CreateRestaurantInput {
  @Field(() => CreateRestaurantInputType)
  data: Prisma.RestaurantCreateInput;
}
