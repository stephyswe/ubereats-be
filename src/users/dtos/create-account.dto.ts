import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { MutationOutput } from '../../common/dtos/output.dto';
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
export class CreateAccountOutput extends MutationOutput {}
