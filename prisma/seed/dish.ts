import { Prisma, PrismaClient } from '@prisma/client';
import { uniqueDishDataOptions } from './data';

const prisma = new PrismaClient();

export async function createDishes() {
  const createdDishes = await prisma.dish.createMany({
    data: dishDataList,
  });
  console.log(`${createdDishes.count} dishes were created!`);
}

export const dishDataList: Prisma.DishCreateManyInput[] = [
  {
    name: 'BBQ House First Dish',
    photo: 'https://source.unsplash.com/random',
    price: 115,
    type: 'Pizza',
    description: 'Juicy!',
    options: [],
    restaurantId: 1,
  },
  {
    name: 'Healthy Salad First Dish',
    photo: 'https://source.unsplash.com/random',
    price: 115,
    type: 'Pizza',
    description: 'Juicy!',
    options: [],
    restaurantId: 2,
  },
  {
    name: 'BBQ House Second Dish',
    photo: 'https://source.unsplash.com/random',
    price: 115,
    type: 'Pizza',
    description: 'Juicy!',
    options: uniqueDishDataOptions,
    restaurantId: 1,
  },
];
