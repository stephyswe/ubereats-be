import { PrismaClient } from '@prisma/client';

import { createCategories } from './seed/category';
import { createDishes } from './seed/dish';
import { createRestaurants } from './seed/restaurant';
import { createUsers } from './seed/user';
import { createVerifications } from './seed/verification';

const prisma = new PrismaClient();

async function main() {
  const users = await createUsers();

  await createVerifications(users);

  await createCategories();

  await createRestaurants();

  await createDishes();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
