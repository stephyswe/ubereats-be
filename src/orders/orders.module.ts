import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';

@Module({
  providers: [PrismaService, OrderService, OrderResolver],
})
export class OrdersModule {}
