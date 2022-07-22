import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { OwnersModule } from '../owners/owners.module';
import { CatOwnerResolver } from './cat-owner.resolver';
import { CatsResolver } from './cats.resolver';
import { CatsService } from './cats.service';

@Module({
  imports: [OwnersModule],
  providers: [PrismaService, CatsService, CatsResolver, CatOwnerResolver],
})
export class CatsModule {}
