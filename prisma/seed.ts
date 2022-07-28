import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'admin@email.com',
    password: '$2a$10$TrsLWPbVb8QH5HZJ86ttyOHMXFpKA025T89ydK52U4mLNQm5oKd1a',
    role: 'Owner',
  },
  {
    email: 'admin2@email.com',
    password: '$2a$10$TrsLWPbVb8QH5HZJ86ttyOHMXFpKA025T89ydK52U4mLNQm5oKd1a',
    role: 'Owner',
  },
  {
    email: 'delivery@email.com',
    password: '$2a$10$TrsLWPbVb8QH5HZJ86ttyOHMXFpKA025T89ydK52U4mLNQm5oKd1a',
    role: 'Delivery',
  },
  {
    email: 'user@email.com',
    password: '$2a$10$TrsLWPbVb8QH5HZJ86ttyOHMXFpKA025T89ydK52U4mLNQm5oKd1a',
    role: 'Client',
  },
];

const vertData = (user: any) => {
  return {
    data: { code: 'b22ed89a-6ba8-4e5d-8a57-2a2d19dd2ae4', userId: user.id },
  };
};

const categoryData = {
  data: {
    name: 'korean bbq',
    coverImg: null,
    slug: 'korean-bbq',
  },
};

const restaurantData = (user: any, category: any) => {
  return {
    data: {
      name: 'BBQ House',
      coverImg: 'https://',
      address: '123 Altavista',
      categoryId: category.id,
      userId: user.id,
    },
  };
};

const dishData = {
  data: {
    name: 'Mexican Chicken',
    restaurantId: 1,
    options: [
      {
        name: 'Spice Level',
        choices: [
          {
            name: 'Little Bit',
          },
          {
            name: 'Strong',
          },
        ],
      },
      {
        name: 'Pickle',
        extra: 1,
      },
      {
        name: 'Size',
        choices: [
          {
            name: 'L',
            extra: 2,
          },
          {
            name: 'XL',
            extra: 5,
          },
        ],
      },
    ],
    price: 12,
    description: 'Delicious!',
  },
  include: {
    restaurant: true,
  },
};

const consoleLog = (title: any, relation: any) =>
  console.log(`Created ${title} with id: ${relation.id}`);

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    consoleLog('user', user);

    const verification = await prisma.verification.create(vertData(user));
    consoleLog('verification', verification);

    if (user.email === 'admin@email.com') {
      const category = await prisma.category.create(categoryData);
      consoleLog('category', category);

      // one restaurant by user
      const restaurant = await prisma.restaurant.create(
        restaurantData(user, category),
      );

      // create a dish on restaurant
      const dish = await prisma.dish.create(dishData);

      console.log(
        `Created dish with id: ${dish.id} on restaurant id: ${restaurant.id}`,
      );
    }
  }

  console.log(`Seeding finished.`);
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
