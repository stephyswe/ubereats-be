import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { CoreInputId, CoreOutput } from 'src/common/dtos/output.dto';

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

@InputType()
class EditProfileInputArgs {
  @Field()
  email: string;
}

@InputType()
export class EditProfileInput {
  @Field(() => CoreInputId)
  where: Prisma.RestaurantWhereUniqueInput;

  @Field(() => EditProfileInputArgs)
  data: Prisma.RestaurantUpdateInput;
}
