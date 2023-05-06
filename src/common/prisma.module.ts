// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  // Assumes that env variables are retrieved
  // from the config module.
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
