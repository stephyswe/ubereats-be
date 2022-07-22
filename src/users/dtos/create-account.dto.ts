import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { UserRole } from '../models/user.model';

@InputType()
export class CreateAccountInputType {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => String)
  role: UserRole;
}

@InputType()
export class CreateAccountInput {
  @Field(() => CreateAccountInputType)
  data: Prisma.UserCreateInput;
}

@ObjectType()
export class CreateAccountOutput {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => Boolean)
  ok: boolean;
}
