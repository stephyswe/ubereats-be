import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../users/models/user.model';
import { CreateOrderOutput } from './dtos/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

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

      await this.prisma.order.create({
        data: {
          customerId: customer.id,
          restaurantId: restaurant.id,
          total: orderFinalPrice,
          items: {
            create: orderItems,
          },
        },
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
