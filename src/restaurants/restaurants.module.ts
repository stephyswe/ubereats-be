import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RestaurantResolver } from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';

@Module({
  providers: [PrismaService, RestaurantService, RestaurantResolver],
})
export class RestaurantsModule {}
