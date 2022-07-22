import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatsService {
  constructor(private prisma: PrismaService) {}

  create(catCreateInput: Prisma.CatCreateInput) {
    return this.prisma.cat.create({
      data: catCreateInput,
    });
  }

  findMany() {
    return this.prisma.cat.findMany();
  }

  findOne(catWhereUniqueInput: Prisma.CatWhereUniqueInput) {
    return this.prisma.cat.findUnique({
      where: catWhereUniqueInput,
    });
  }
}
