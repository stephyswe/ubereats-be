import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { OwnersService } from './owners.service';

@Module({
  providers: [PrismaService, OwnersService],
  exports: [OwnersService],
})
export class OwnersModule {}
