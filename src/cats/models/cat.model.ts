import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Owner {
  @Field(() => Int)
  id?: number;

  name: string;

  @Field(() => Int)
  age?: number;

  cats?: Cat[];
}

@ObjectType()
export class Cat {
  @Field(() => Int)
  id?: number;

  name?: string;

  @Field(() => Int)
  age?: number;

  owner?: Owner;
}
