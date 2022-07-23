import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/models/core.model';
import { User } from './user.model';

@InputType({ isAbstract: true })
@ObjectType()
export class Verification extends CoreEntity {
  @Field(() => String)
  code: string;

  @Field()
  user: User;
}
