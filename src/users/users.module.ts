import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [PrismaService, UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
