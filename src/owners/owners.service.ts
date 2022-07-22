import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OwnersService {
  constructor(private prisma: PrismaService) {}

  findOne(ownerWhereUniqueInput: Prisma.OwnerWhereUniqueInput) {
    return this.prisma.owner.findUnique({
      where: ownerWhereUniqueInput,
    });
  }
}
