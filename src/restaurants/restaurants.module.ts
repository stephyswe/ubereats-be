import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CategoryResolver,
  DishResolver,
  RestaurantResolver,
} from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';

@Module({
  providers: [
    PrismaService,
    DishResolver,
    CategoryResolver,
    RestaurantService,
    RestaurantResolver,
  ],
})
export class RestaurantsModule {}
