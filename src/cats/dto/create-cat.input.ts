import { Min } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '"Test comment"' })
export class CreateCatInput {
  @Field()
  @Min(1)
  age: number;

  @Field()
  name: string;
}
