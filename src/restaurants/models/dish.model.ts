import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString, Length } from 'class-validator';
import { Restaurant } from './restaurant.model';

import { CoreInputId } from './../../common/dtos/output.dto';

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
export class Dish extends CoreInputId {
  @Field(() => String)
  @IsString()
  @Length(5)
  name: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  price: number;

  @Field(() => String)
  @IsString()
  photo?: string;

  @Field(() => String)
  @Length(5, 140)
  description?: string;

  @Field(() => Restaurant)
  restaurant?: Restaurant;

  @Field(() => [DishOption], { nullable: true })
  options?: DishOption[];
}

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
class DishOption {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  extra?: number;

  @Field(() => [DishChoice])
  choices?: DishChoice[];
}

@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
  @Field(() => String)
  name: string;
  @Field(() => Int, { nullable: true })
  extra?: number;
}
