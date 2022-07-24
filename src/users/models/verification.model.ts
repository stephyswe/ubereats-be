import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
@InputType({ isAbstract: true })
@ObjectType()
export class Verification {
  @Field(() => String)
  code: string;

  @Field()
  user: User;
}
