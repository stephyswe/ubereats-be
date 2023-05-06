import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUsers() {
  const createdUsers = await prisma.user.createMany({
    data: userDataList,
  });

  console.log(`${createdUsers.count} users were created!`);

  return await prisma.user.findMany();
}

export const userDataList: Prisma.UserCreateInput[] = [
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
