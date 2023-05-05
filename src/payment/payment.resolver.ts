import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';

import { Role } from 'src/auth/role.decorator';
import { CurrentUser } from '../auth/auth-user.decorator';

import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { FindManyPaymentOutput } from './dtos/find-payments.dto';
import { Payment } from './models/payment.model';
import { PaymentService } from './payment.service';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Query(() => FindManyPaymentOutput)
  @Role(['Owner'])
  findManyPayments(@CurrentUser() user: User) {
    return this.paymentService.findManyPayments(user);
  }

  @Mutation(() => CreatePaymentOutput)
  @Role(['Owner'])
  createPayment(
    @CurrentUser() owner: User,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return this.paymentService.createPayment(owner, createPaymentInput);
  }
}
