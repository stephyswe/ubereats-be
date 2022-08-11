import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreInputId } from '../../common/dtos/output.dto';
import { Restaurant } from './restaurant.model';

@InputType({ isAbstract: true })
@ObjectType()
export class Category extends CoreInputId {
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
  restaurants?: Restaurant[];
}
