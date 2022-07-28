import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import {
  FindManyOrdersInput,
  FindManyOrdersOutput,
} from './dtos/find-orders.dto';

import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from '../auth/auth-user.decorator';
import { Role } from '../auth/role.decorator';
import { NEW_PENDING_ORDER, PUB_SUB } from '../common/common.constants';
import { User } from '../users/models/user.model';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { FindOrderInput, FindOrderOutput } from './dtos/find-order.dto';
import { UpdateOrderInput, UpdateOrderOutput } from './dtos/update-order.dto';
import { Order } from './models/order.model';
import { OrderService } from './orders.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

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

  @Mutation(() => UpdateOrderOutput)
  @Role(['Any'])
  async updateOrder(
    @CurrentUser() user: User,
    @Args('input') updateOrderInput: UpdateOrderInput,
  ): Promise<UpdateOrderOutput> {
    return this.orderService.updateOrder(user, updateOrderInput);
  }

  @Subscription(() => Order, {
    filter: ({ pendingOrders: { ownerId } }, _, { user: { id } }) => {
      return ownerId === id;
    },
    resolve: ({ pendingOrders: { order } }) => order,
  })
  @Role(['Owner'])
  async pendingOrders(@CurrentUser() user: User) {
    return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
  }
}
