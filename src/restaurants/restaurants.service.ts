import { Injectable } from '@nestjs/common';

import { PrismaService } from '../common/prisma.service';
import { User } from '../users/models/user.model';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { FindManyCategoriesOutput } from './dtos/find-categories.dto';
import { CategoryInput } from './dtos/find-category.dto';
import { RestaurantInput } from './dtos/find-restaurant.dto';
import { RestaurantsInput } from './dtos/find-restaurants.dto';
import { MyRestaurantInput } from './dtos/my-restaurant.dto';
import { SearchRestaurantInput } from './dtos/search-restaurant.dto';
import { EditDishInput } from './dtos/update-dish.dto';
import { UpdateRestaurantInput } from './dtos/update-restaurant.dto';
import { Category } from './models/category.model';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async findMany({ page }: RestaurantsInput) {
    try {
      const totalResults = await this.prisma.restaurant.count();
      const restaurants = await this.prisma.restaurant.findMany({
        skip: (page - 1) * 25,
        take: 25,
        include: { category: true },
      });

      return {
        ok: true,
        results: restaurants,
        totalPages: Math.ceil(totalResults / 3),
        totalResults,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load restaurants',
      };
    }
  }

  async find({ restaurantId }: RestaurantInput) {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: { menu: true },
      });
      if (!restaurant) throw new Error('Restaurant not found');
      return { ok: true, results: restaurant };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async searchByName({ query, page }: SearchRestaurantInput) {
    try {
      const totalResults = await this.prisma.restaurant.count();
      const results = await this.prisma.restaurant.findMany({
        skip: (page - 1) * 25,
        take: 25,
        where: { name: { contains: query, mode: 'insensitive' } },
      });

      return {
        ok: true,
        results,
        totalResults,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch {
      return { ok: false, error: 'Could not search for restaurants' };
    }
  }

  async create(owner: User, createRestaurantInput: CreateRestaurantInput) {
    try {
      const category = await this.categoryFindOrCreate(
        createRestaurantInput.categoryName,
      );

      delete createRestaurantInput.categoryName;

      const restaurant = await this.prisma.restaurant.create({
        data: {
          ...createRestaurantInput,
          categoryId: category.id,
          userId: owner.id,
        },
      });

      return {
        ok: true,
        restaurantId: restaurant.id,
      };
    } catch (error) {
      return { ok: false, error: 'Could not create restaurant' };
    }
  }

  async update(owner: User, params: UpdateRestaurantInput) {
    try {
      const id = params.restaurantId;
      const categoryName = params.categoryName;
      let category = null;

      delete params.categoryName;
      delete params.restaurantId;

      const restaurant = await this.prisma.restaurant.findFirst({
        where: { id },
      });

      if (!restaurant) return { ok: false, error: 'Restaurant not found' };

      if (owner.id !== restaurant.userId) {
        return {
          ok: false,
          error: "You can't edit a restaurant you don't own.",
        };
      }

      if (categoryName) {
        category = await this.categoryFindOrCreate(categoryName);
      }

      await this.prisma.restaurant.update({
        where: { id },
        data: {
          ...params,
          ...(categoryName && { categoryId: category.id }),
        },
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async delete(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
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
      if (owner.id !== restaurant.userId) {
        return {
          ok: false,
          error: "You can't delete a restaurant that you don't own",
        };
      }
      await this.prisma.restaurant.delete({ where: { id: restaurantId } });
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not delete restaurant.',
      };
    }
  }

  async myRestaurants(owner: User) {
    try {
      const restaurants = await this.prisma.restaurant.findMany({
        where: { userId: owner.id },
        include: { category: true },
      });
      return {
        restaurants,
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find restaurants.',
      };
    }
  }
  async myRestaurant(owner: User, { id }: MyRestaurantInput) {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: id },
        include: { menu: true, orders: true },
      });

      return {
        restaurant,
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find restaurant',
      };
    }
  }

  countRestaurants(category: Category) {
    return this.prisma.restaurant.count({
      where: { categoryId: category.id },
    });
  }

  async findManyCategories(): Promise<FindManyCategoriesOutput> {
    try {
      const categories = await this.prisma.category.findMany({
        orderBy: { id: 'asc' },
      });
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findCategoryBySlug({ slug, page }: CategoryInput) {
    try {
      const category = await this.prisma.category.findFirst({
        where: { slug: slug },
      });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      const restaurants = await this.prisma.restaurant.findMany({
        where: {
          categoryId: category.id,
        },
        take: 25,
        skip: (page - 1) * 25,
      });
      const totalResults = await this.countRestaurants(category);
      return {
        ok: true,
        restaurants,
        category,
        totalPages: Math.ceil(totalResults / 25),
        totalResults,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }

  async categoryFindOrCreate(name: string) {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, '-');
    let category = await this.prisma.category.findFirst({
      where: { slug: categorySlug },
    });
    if (!category) {
      category = await this.prisma.category.create({
        data: { slug: categorySlug, name: categoryName },
      });
    }
    return category;
  }

  async findManyDishesIds(dishIds: any) {
    const results = await this.prisma.dish.findMany({
      where: { id: { in: dishIds.dishIds } },
      include: {
        restaurant: true,
      },
    });

    return { ok: true, results };
  }

  async findManyDishes() {
    const results = await this.prisma.dish.findMany({
      include: {
        restaurant: true,
      },
    });

    return { ok: true, results };
  }

  async createDish(owner: User, createDishInput) {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: createDishInput.restaurantId },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== restaurant.userId) {
        return {
          ok: false,
          error: "You aren't the restaurant owner.",
        };
      }
      const dish = await this.prisma.dish.create({
        data: {
          ...createDishInput,
          restaurantId: restaurant.id,
        },
        include: {
          restaurant: true,
        },
      });

      return {
        ok: true,
        dish,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create dish',
      };
    }
  }

  async updateDish(owner: User, editDishInput: EditDishInput) {
    try {
      const id = editDishInput.dishId;
      const newOptions = editDishInput.options as string;
      delete editDishInput.dishId;
      delete editDishInput.options;

      const dish = await this.prisma.dish.findUnique({
        where: { id },
        include: { restaurant: true },
      });
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found',
        };
      }
      if (dish.restaurant.userId !== owner.id) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }

      await this.prisma.dish.update({
        where: { id },
        data: {
          ...editDishInput,
          options: newOptions,
        },
      });

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not update dish',
      };
    }
  }

  async deleteDish(
    owner: User,
    { dishId }: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      const dish = await this.prisma.dish.findUnique({
        where: { id: dishId },
        include: { restaurant: true },
      });
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found',
        };
      }
      if (dish.restaurant.userId !== owner.id) {
        return {
          ok: false,
          error: "You can't delete a dish without rights.",
        };
      }
      await this.prisma.dish.delete({ where: { id: dishId } });
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not delete dish',
      };
    }
  }
}
