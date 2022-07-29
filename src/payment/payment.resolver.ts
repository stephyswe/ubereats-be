import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';

import { Role } from 'src/auth/role.decorator';
import { CurrentUser } from '../auth/auth-user.decorator';

import { CreatePaymentInput, CreatePaymentOutput } from './dtos/create-payment.dto';
import { Payment } from './models/payment.model';
import { PaymentService } from './payment.service';


@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => CreatePaymentOutput)
  @Role(['Owner'])
  createPayment(
    @CurrentUser() owner: User,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return this.paymentService.createPayment(owner, createPaymentInput);
  }
}