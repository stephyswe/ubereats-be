import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'user@email.com',
    password: '$2a$10$TrsLWPbVb8QH5HZJ86ttyOHMXFpKA025T89ydK52U4mLNQm5oKd1a',
    role: 'Client',
  },
  {
    email: 'admin@email.com',
    password: '$2a$10$TrsLWPbVb8QH5HZJ86ttyOHMXFpKA025T89ydK52U4mLNQm5oKd1a',
    role: 'Owner',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);

    const verification = await prisma.verification.create({
      data: {
        code: 'b22ed89a-6ba8-4e5d-8a57-2a2d19dd2ae4',
        userId: user.id,
      },
    });
    console.log(`Created verification with id: ${verification.id}`);

    if (user.email === 'admin@email.com') {
      const category = await prisma.category.create({
        data: {
          name: 'korean bbq',
          coverImg: null,
          slug: 'korean-bbq',
        },
      });

      console.log(`Created category with id: ${category.id}`);

      // one restaurant by user
      const restaurant = await prisma.restaurant.create({
        data: {
          name: 'BBQ House',
          coverImg: 'https://',
          address: '123 Altavista',
          categoryId: category.id,
          userId: user.id,
        },
      });

      console.log(`Created restaurant with id: ${restaurant.id}`);
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
