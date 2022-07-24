import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';

import { CoreInputId, CoreOutput } from '../../common/dtos/output.dto';

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

@InputType()
export class EditProfileInputArgs {
  @Field()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  verified?: boolean;
}

@InputType()
export class EditProfileInput {
  @Field(() => CoreInputId)
  where: Prisma.UserWhereUniqueInput;

  @Field(() => EditProfileInputArgs)
  data: Prisma.UserUpdateInput;
}
