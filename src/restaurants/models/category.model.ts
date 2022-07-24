import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Restaurant } from './restaurant.model';

@ObjectType()
export class Category {
  @Field(() => String)
  @IsString()
  @Length(5)
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  coverImg?: string;

  @Field(() => String)
  @IsString()
  slug: string;

  @Field(() => [Restaurant])
  restaurants: Restaurant[];
}
