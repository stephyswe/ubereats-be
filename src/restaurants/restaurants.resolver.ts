import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { CurrentUser } from '../auth/auth-user.decorator';
import { Role } from '../auth/role.decorator';
import { User } from '../users/models/user.model';
import {
  CreateRestaurantInputArgs,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { FindManyCategoriesOutput } from './dtos/find-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/find-category.dto';
import {
  UpdateRestaurantInputArgs,
  UpdateRestaurantOutput,
} from './dtos/update-restaurant.dto';
import { Category } from './models/category.model';
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
  @Role(['Owner'])
  async updateRestaurant(
    @CurrentUser() owner: User,
    @Args('input') args: UpdateRestaurantInputArgs,
  ): Promise<UpdateRestaurantOutput> {
    return this.restaurantService.update(owner, args);
  }

  @Mutation(() => DeleteRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @CurrentUser() owner: User,
    @Args('input') args: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.delete(owner, args);
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField(() => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurants(category);
  }

  @Query(() => FindManyCategoriesOutput)
  findManyCategories(): Promise<FindManyCategoriesOutput> {
    return this.restaurantService.findManyCategories();
  }

  @Query(() => CategoryOutput)
  category(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}
