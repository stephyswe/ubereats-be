import { Field } from '@nestjs/graphql';

export class CoreEntity {
  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;
}
