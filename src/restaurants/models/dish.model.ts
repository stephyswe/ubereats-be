import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

import { CoreInputId } from './../../common/dtos/output.dto';

@InputType({ isAbstract: true })
@ObjectType()
export class Dish extends CoreInputId {
  @Field(() => String)
  @IsString()
  @Length(5)
  name: string;

  @Field(() => Int, { nullable: true })
  @IsString()
  price: number;

  @Field(() => String)
  @IsString()
  photo?: string;

  @Field(() => String)
  @Length(5, 140)
  description?: string;
}
