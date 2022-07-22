import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Owner {
  @Field(() => Int)
  id?: number;

  @Field()
  name: string;

  @Field(() => Int)
  age?: number;

  @Field(() => [Cat])
  cats?: Cat[];
}

@ObjectType()
export class Cat {
  @Field(() => Int)
  id?: number;

  @Field()
  name?: string;

  @Field(() => Int)
  age?: number;

  @Field(() => Owner)
  owner?: Owner;
}
