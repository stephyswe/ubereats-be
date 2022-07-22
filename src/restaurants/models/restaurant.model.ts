import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@ObjectType()
export class Restaurant {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  @IsString()
  @Length(5, 15)
  name: string;

  @Field(() => String)
  @IsString()
  address: string;
}
