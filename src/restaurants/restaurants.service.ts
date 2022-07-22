import { Injectable } from '@nestjs/common';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';

import { PrismaService } from '../../prisma/prisma.service';
import { UpdateRestaurantInput } from './dtos/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}
  findMany() {
    return this.prisma.restaurant.findMany();
  }

  create(params: CreateRestaurantInput) {
    return this.prisma.restaurant.create(params);
  }

  update(params: UpdateRestaurantInput) {
    return this.prisma.restaurant.update(params);
  }
}
