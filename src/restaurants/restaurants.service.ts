import { Injectable } from '@nestjs/common';
import { CreateRestaurantInputArgs } from './dtos/create-restaurant.dto';

import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../users/models/user.model';
import { UpdateRestaurantInput } from './dtos/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  findMany() {
    return this.prisma.restaurant.findMany();
  }

  async create(owner: User, createRestaurantInput: CreateRestaurantInputArgs) {
    try {
      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.prisma.category.findFirst({
        where: { slug: categorySlug },
      });
      if (!category) {
        category = await this.prisma.category.create({
          data: { slug: categorySlug, name: categoryName },
        });
      }

      delete createRestaurantInput.categoryName;

      await this.prisma.restaurant.create({
        data: {
          ...createRestaurantInput,
          categoryId: category.id,
          userId: owner.id,
        },
      });

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  update(params: UpdateRestaurantInput) {
    return this.prisma.restaurant.update(params);
  }
}
