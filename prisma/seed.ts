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
    name: 'Fast Food',
    coverImg:
      'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/FastFood_CuisineCarousel@2x.png',
    slug: 'fast-food',
  },
};

const categoryDataMany = {
  data: [
    {
      name: 'Breakfast And Brunch',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Breakfast_CuisineCarousel@2x.png',
      slug: 'breakfast-and-brunch',
    },
    {
      name: 'American Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/American_CuisineCarousel@2x.png',
      slug: 'american',
    },
    {
      name: 'Mexican Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Mexican_CuisineCarousel@2x.png',
      slug: 'mexican',
    },
    {
      name: 'Chinese Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Chinese_CuisineCarousel@2x.png',
      slug: 'chinese',
    },
    {
      name: 'Japanese Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Japanese_CuisineCarousel@2x.png',
      slug: 'japanese',
    },
    {
      name: 'Italian Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Italian_CuisineCarousel@2x.png',
      slug: 'italian',
    },
    {
      name: 'Healthy Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Healthy_CuisineCarousel@2x.png',
      slug: 'healthy',
    },
    {
      name: 'Asian Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Asian_CuisineCarousel@2x.png',
      slug: 'asian',
    },
    {
      name: 'Indian Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Asian_CuisineCarousel@2x.png',
      slug: 'indian',
    },
    {
      name: 'Thai Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Thai_CuisineCarousel@2x.png',
      slug: 'thai',
    },
    {
      name: 'Taiwanese Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Taiwanese_CuisineCarousel@2x.png',
      slug: 'taiwanese',
    },
  ],
};

const restaurantData = (user: any, category: any) => {
  return {
    data: {
      name: 'BBQ House',
      coverImg:
        'https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kMXJhbHNvZ25qbmczNy5jbG91ZGZyb250Lm5ldC8wY2M1NDBiOS1lMjFiLTQ1YzAtOWQ2NS1mMzMzODNiYTE5MWIuanBlZw==',
      address: '123 Altavista',
      categoryId: category.id,
      userId: user.id,
    },
  };
};

const dishDataMany = {
  data: [
    {
      restaurantId: 1,
      name: 'Pizza Speciale',
      price: 115,
      type: 'Pizza',
      description: 'Juicy!',
      photo: '',
      options: [],
    },
    {
      restaurantId: 1,
      name: 'Räksallad',
      price: 115,
      type: 'Sallader',
      description:
        'Räkor, vitost, ägg, citron, grekiska kalamataoliver. Isbergssallad, färska tomater, gurka, lök, vitost och bröd ingår.',
      photo: '',
      options: [],
    },
    {
      restaurantId: 1,
      name: 'KycklingSallad',
      price: 115,
      type: 'Sallader',
      description:
        'Kyckling, vitost, färsk paprika, ananas. Isbergssallad, färska tomater, gurka, lök, vitost och bröd ingår.',
      photo:
        'https://tb-static.uber.com/prod/image-proc/processed_images/fbf500543dbcc1a91bcb8de08a66396f/ffd640b0f9bc72838f2ebbee501a5d4b.jpeg',
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
    },
  ],
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
      const dishes = await prisma.dish.createMany(dishDataMany);

      console.log(`Created ${dishes.count} on restaurant id: ${restaurant.id}`);
    }
  }

  // create all categories
  await prisma.category.createMany(categoryDataMany);

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
