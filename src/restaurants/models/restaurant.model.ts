import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { User } from '../../users/models/user.model';
import { Category } from './category.model';

@InputType({ isAbstract: true })
@ObjectType()
export class Restaurant {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  @IsString()
  @Length(5, 15)
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  coverImg: string;

  @Field(() => String)
  @IsString()
  address: string;

  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field(() => User, { nullable: true })
  owner?: User;
}
