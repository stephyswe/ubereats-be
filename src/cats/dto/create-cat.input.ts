import { Min } from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType({ description: '"Test comment"' })
export class CreateCatInput {
  @Min(1)
  age: number;
}
