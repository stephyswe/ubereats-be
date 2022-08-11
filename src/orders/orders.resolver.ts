import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import {
  FindManyOrdersInput,
  FindManyOrdersOutput,
} from './dtos/find-orders.dto';

import { CurrentUser } from '../auth/auth-user.decorator';
import { Role } from '../auth/role.decorator';
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
  NEW_PENDING_ORDER,
} from '../common/common.constants';
import { pubSub } from '../common/common.module';
import { User } from '../users/models/user.model';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { FindOrderInput, FindOrderOutput } from './dtos/find-order.dto';
import { TakeOrderInput, TakeOrderOutput } from './dtos/take-order.dto';
import { OrderUpdatesInput } from './dtos/update-dto';
import { UpdateOrderInput, UpdateOrderOutput } from './dtos/update-order.dto';
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

  @Mutation(() => UpdateOrderOutput)
  @Role(['Any'])
  async updateOrder(
    @CurrentUser() user: User,
    @Args('input') updateOrderInput: UpdateOrderInput,
  ): Promise<UpdateOrderOutput> {
    return this.orderService.updateOrder(user, updateOrderInput);
  }

  @Mutation(() => TakeOrderOutput)
  @Role(['Delivery'])
  updateOrderDriver(
    @CurrentUser() driver: User,
    @Args('input') takeOrderInput: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    return this.orderService.updateOrderDriver(driver, takeOrderInput);
  }

  @Subscription(() => Order, {
    filter: ({ pendingOrders: { ownerId } }, _, { user: { id } }) => {
      return ownerId === id;
    },
    resolve: ({ pendingOrders: { order } }) => order,
  })
  @Role(['Owner'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pendingOrders(@CurrentUser() _: User) {
    return pubSub.asyncIterator(NEW_PENDING_ORDER);
  }

  @Subscription(() => Order, {
    resolve: ({ cookedOrders: order }) => order,
  })
  @Role(['Delivery'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cookedOrders(@CurrentUser() _: User) {
    return pubSub.asyncIterator(NEW_COOKED_ORDER);
  }

  @Subscription(() => Order, {
    filter: (
      { orderUpdates: order }: { orderUpdates: Order },
      { input }: { input: OrderUpdatesInput },
      { user }: { user: User },
    ) => {
      if (
        order.driverId !== user.id &&
        order.customer.id !== user.id &&
        order.restaurant.userId !== user.id
      ) {
        return false;
      }
      return order.id === input.id;
    },
    resolve: ({ orderUpdates: order }) => order,
  })
  @Role(['Any'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orderUpdates(@Args('input') _: OrderUpdatesInput) {
    return pubSub.asyncIterator(NEW_ORDER_UPDATE);
  }
}
