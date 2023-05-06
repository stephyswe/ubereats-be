import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma.module';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';

@Module({
  imports: [PrismaModule],
  providers: [OrderService, OrderResolver],
})
export class OrdersModule {}
