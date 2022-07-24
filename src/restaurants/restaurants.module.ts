import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryResolver, RestaurantResolver } from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';

@Module({
  providers: [
    PrismaService,
    CategoryResolver,
    RestaurantService,
    RestaurantResolver,
  ],
})
export class RestaurantsModule {}
