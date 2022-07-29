import { Field, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '../../common/dtos/output.dto';
import { Restaurant } from '../models/restaurant.model';

@ObjectType()
export class MyRestaurantsOutput extends CoreOutput {
  @Field(() => [Restaurant])
  restaurants?: Restaurant[];
}