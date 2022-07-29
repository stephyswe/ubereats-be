import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { FindManyPaymentOutput } from './dtos/find-payments.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async findManyPayments(user: User) {
    try {
      const payments = await this.prisma.payment.findMany({
        where: { user },
        include: { user: true, restaurant: true },
      });
      return {
        ok: true,
        payments,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load payments.',
      };
    }
  }

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }
      if (restaurant.userId !== owner.id) {
        return {
          ok: false,
          error: 'You are not allowed to do this.',
        };
      }

      await this.prisma.payment.create({
        data: {
          transactionId,
          userId: owner.id,
          restaurantId: restaurant.id,
        },
      });

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not create payment.' };
    }
  }
}
