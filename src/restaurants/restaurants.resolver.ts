import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../auth/auth-user.decorator';
import { User } from '../users/models/user.model';
import {
  CreateRestaurantInputArgs,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
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
  async createRestaurant(
    @CurrentUser() authUser: User,
    @Args('createRestaurantDto') args: CreateRestaurantInputArgs,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.create(authUser, args);
  }
  /* 
  @Mutation(() => Boolean)
  async updateRestaurant(@Args('input') args: UpdateRestaurantInput) {
    try {
      await this.restaurantService.update(args);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  } */
}
