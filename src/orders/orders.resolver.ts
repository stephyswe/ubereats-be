import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  FindManyOrdersInput,
  FindManyOrdersOutput,
} from './dtos/find-orders.dto';

import { CurrentUser } from '../auth/auth-user.decorator';
import { Role } from '../auth/role.decorator';
import { User } from '../users/models/user.model';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { FindOrderInput, FindOrderOutput } from './dtos/find-order.dto';
import { Order } from './models/order.model';
import { OrderService } from './orders.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => FindManyOrdersOutput)
  @Role(['Any'])
  async findManyOrders(
    @CurrentUser() user: User,
    @Args('input') findOrdersInput: FindManyOrdersInput,
  ) {
    return this.orderService.findManyOrders(user, findOrdersInput);
  }

  @Query(() => FindOrderOutput)
  @Role(['Any'])
  async findOrder(
    @CurrentUser() user: User,
    @Args('input') findOrderInput: FindOrderInput,
  ) {
    return this.orderService.findOrder(user, findOrderInput);
  }

  @Mutation(() => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @CurrentUser() customer: User,
    @Args('input')
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.orderService.createOrder(customer, createOrderInput);
  }
}
