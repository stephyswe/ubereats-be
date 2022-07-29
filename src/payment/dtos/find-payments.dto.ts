import { Field, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from 'src/common/dtos/output.dto';
import { Payment } from '../models/payment.model';

@ObjectType()
export class FindManyPaymentOutput extends CoreOutput {
  @Field(() => [Payment], { nullable: true })
  payments?: Payment[];
}
