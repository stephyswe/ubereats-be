import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { UpdateRestaurantInput } from './dtos/update-restaurant.dto';
import { Restaurant } from './models/restaurant.model';
import { RestaurantService } from './restaurants.service';

@Resolver()
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => [Restaurant])
  restaurants() {
    return this.restaurantService.findMany();
  }

  @Mutation(() => Boolean)
  async createRestaurant(
    @Args('createRestaurantDto') args: CreateRestaurantInput,
  ): Promise<boolean> {
    try {
      await this.restaurantService.create(args);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async updateRestaurant(@Args('input') args: UpdateRestaurantInput) {
    try {
      await this.restaurantService.update(args);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
