import { Field, ObjectType } from '@nestjs/graphql';

import { Category } from '../models/category.model';
import { CoreOutput } from './../../common/dtos/output.dto';

@ObjectType()
export class FindManyCategoriesOutput extends CoreOutput {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
