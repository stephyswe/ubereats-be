import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createRestaurants() {
  const restaurants = await prisma.restaurant.createMany({
    data: restaurantDataList,
  });
  console.log(`${restaurants.count} restaurants were created!`);
}

const restaurantDataList: Prisma.RestaurantCreateManyInput[] = [
  {
    name: 'BBQ House First',
    address: '123 Main St',
    categoryId: 1,
    userId: 1,
  },
  {
    name: 'Healthy Salad',
    address: '123 Main St',
    categoryId: 1,
    userId: 2,
  },
];
