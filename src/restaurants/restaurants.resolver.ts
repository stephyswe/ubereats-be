import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../auth/auth-user.decorator';
import { Role } from '../auth/role.decorator';
import { User } from '../users/models/user.model';
import {
  CreateRestaurantInputArgs,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  UpdateRestaurantInputArgs,
  UpdateRestaurantOutput,
} from './dtos/update-restaurant.dto';
import { Restaurant } from './models/restaurant.model';
import { RestaurantService } from './restaurants.service';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => [Restaurant])
  restaurants() {
    return this.restaurantService.findMany();
  }

  @Mutation(() => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @CurrentUser() owner: User,
    @Args('createRestaurantDto') args: CreateRestaurantInputArgs,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.create(owner, args);
  }

  @Mutation(() => UpdateRestaurantOutput)
  async updateRestaurant(
    @CurrentUser() owner: User,
    @Args('input') args: UpdateRestaurantInputArgs,
  ): Promise<UpdateRestaurantOutput> {
    return this.restaurantService.update(owner, args);
  }
}
