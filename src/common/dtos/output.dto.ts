import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => Boolean)
  ok: boolean;
}

@InputType()
export class CoreInputId {
  @Field()
  id: number;
}
