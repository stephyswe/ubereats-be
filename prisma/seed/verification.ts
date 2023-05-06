import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createVerifications(users: any[]) {
  const verificationDataList: Prisma.VerificationCreateManyInput[] = users.map(
    (user) => {
      return {
        code: 'b22ed89a-6ba8-4e5d-8a57-2a2d19dd2ae4',
        userId: user.id,
      };
    },
  );

  const verifications = await prisma.verification.createMany({
    data: verificationDataList,
  });

  console.log(`${verifications.count} verifications were created!`);
}
