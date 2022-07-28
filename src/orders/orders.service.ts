import { Inject, Injectable } from '@nestjs/common';
import { Order as PrismaOrders } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';

import { PrismaService } from '../../prisma/prisma.service';
import {
  NEW_COOKED_ORDER,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from '../common/common.constants';
import { User, UserRole } from '../users/models/user.model';
import { CreateOrderOutput } from './dtos/create-order.dto';
import { FindOrderInput } from './dtos/find-order.dto';
import { FindManyOrdersInput } from './dtos/find-orders.dto';
import { UpdateOrderInput, UpdateOrderOutput } from './dtos/update-order.dto';
import { OrderStatus } from './models/order.model';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async findManyOrders(user: User, { status }: FindManyOrdersInput) {
    try {
      let orders: PrismaOrders[];
      if (user.role === UserRole.Client) {
        orders = await this.prisma.order.findMany({
          where: {
            customerId: user.id,
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRole.Delivery) {
        orders = await this.prisma.order.findMany({
          where: {
            driverId: user.id,
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRole.Owner) {
        const restaurants = await this.prisma.restaurant.findMany({
          where: {
            userId: user.id,
          },
          include: { orders: true },
        });
        orders = restaurants.map((restaurant) => restaurant.orders).flat(1);
        if (status) {
          orders = orders.filter((order) => order.status === status);
        }
      }
      return {
        ok: true,
        orders,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find orders',
      };
    }
  }

  async findOrder(user: User, { id }: FindOrderInput) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { restaurant: true },
      });

      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }

      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: 'You cant see that',
        };
      }

      return {
        ok: true,
        order,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async createOrder(
    customer: User,
    { restaurantId, items },
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      let orderFinalPrice = 0;
      const orderItems = [];

      for (const item of items) {
        let dish;
        // eslint-disable-next-line prefer-const
        dish = await this.prisma.dish.findUnique({
          where: { id: item.dishId },
        });

        if (!dish) {
          // abort this whole thing
          return { ok: false, error: 'Dish not found.' };
        }

        let dishFinalPrice = dish.price;
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (dishOption: { name: any }) => dishOption.name === itemOption.name,
          );

          if (dishOption) {
            if (dishOption.extra) {
              dishFinalPrice = dishFinalPrice + dishOption.extra;
            } else {
              const dishOptionChoice = dishOption.choices?.find(
                (optionChoice: { name: any }) =>
                  optionChoice.name === itemOption.choice,
              );

              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                }
              }
            }
          }
        }
        orderFinalPrice = orderFinalPrice + dishFinalPrice;

        orderItems.push({
          dishId: dish.id,
          options: item.options,
        });
      }

      const order = await this.prisma.order.create({
        data: {
          customerId: customer.id,
          restaurantId: restaurant.id,
          total: orderFinalPrice,
          items: {
            create: orderItems,
          },
        },
        include: { items: true, customer: true, restaurant: true },
      });

      await this.pubSub.publish(NEW_PENDING_ORDER, {
        pendingOrders: { order, ownerId: restaurant.userId },
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return {
        ok: false,
        error: 'Order not found.',
      };
    }
  }

  async updateOrder(
    user: User,
    { id: orderId, status }: UpdateOrderInput,
  ): Promise<UpdateOrderOutput> {
    try {
      await this.findById(orderId);

      if (!this.canUpdateOrder(user, status)) {
        return {
          ok: false,
          error: 'You cant update without permission',
        };
      }

      const newOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status,
        },
        include: { restaurant: true, customer: true },
      });

      if (user.role === UserRole.Owner) {
        if (status === OrderStatus.Cooked) {
          await this.pubSub.publish(NEW_COOKED_ORDER, {
            cookedOrders: { ...newOrder, status },
          });
        }
      }
      console.log(newOrder);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not update order.',
      };
    }
  }

  canSeeOrder(user: User, order): boolean {
    let canSee = true;

    if (user.role === UserRole.Client && order.customerId !== user.id) {
      canSee = false;
    }
    if (user.role === UserRole.Delivery && order.driverId !== user.id) {
      canSee = false;
    }
    if (user.role === UserRole.Owner && order.restaurant.userId !== user.id) {
      canSee = false;
    }
    return canSee;
  }

  canUpdateOrder(user: User, status: OrderStatus) {
    let canUpdate = true;
    if (user.role === UserRole.Client) {
      canUpdate = false;
    }

    if (user.role === UserRole.Owner) {
      if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
        canUpdate = false;
      }
    }

    if (user.role === UserRole.Delivery) {
      if (status !== OrderStatus.PickedUp && status !== OrderStatus.Delivered) {
        canUpdate = false;
      }
    }
    return canUpdate;
  }
}
