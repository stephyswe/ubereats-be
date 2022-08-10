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
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { FindManyCategoriesOutput } from './dtos/find-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/find-category.dto';
import { FindManyDishesOutput } from './dtos/find-dishes.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/find-restaurant.dto';
import {
  RestaurantsInput,
  RestaurantsOutput,
} from './dtos/find-restaurants.dto';
import {
  MyRestaurantInput,
  MyRestaurantOutput,
} from './dtos/my-restaurant.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dtos/update-dish.dto';
import {
  UpdateRestaurantInput,
  UpdateRestaurantOutput,
} from './dtos/update-restaurant.dto';
import { Category } from './models/category.model';
import { Dish } from './models/dish.model';
import { Restaurant } from './models/restaurant.model';
import { RestaurantService } from './restaurants.service';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => MyRestaurantsOutput)
  @Role(['Owner'])
  myRestaurants(@CurrentUser() owner: User) {
    return this.restaurantService.myRestaurants(owner);
  }

  @Query(() => MyRestaurantOutput)
  @Role(['Owner'])
  myRestaurant(
    @CurrentUser() owner: User,
    @Args('input') myRestaurantInput: MyRestaurantInput,
  ) {
    return this.restaurantService.myRestaurant(owner, myRestaurantInput);
  }

  @Query(() => RestaurantsOutput)
  findManyRestaurants(@Args('input') args: RestaurantsInput) {
    return this.restaurantService.findMany(args);
  }

  @Query(() => RestaurantOutput)
  findRestaurant(@Args('input') args: RestaurantInput) {
    return this.restaurantService.find(args);
  }

  @Query(() => SearchRestaurantOutput)
  searchRestaurant(@Args('input') args: SearchRestaurantInput) {
    return this.restaurantService.searchByName(args);
  }

  @Mutation(() => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @CurrentUser() owner: User,
    @Args('createRestaurantDto') args: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.create(owner, args);
  }

  @Mutation(() => UpdateRestaurantOutput)
  @Role(['Owner'])
  async updateRestaurant(
    @CurrentUser() owner: User,
    @Args('input') args: UpdateRestaurantInput,
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
  countRestaurants(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurants(category);
  }

  @Query(() => FindManyCategoriesOutput)
  findManyCategories(): Promise<FindManyCategoriesOutput> {
    return this.restaurantService.findManyCategories();
  }

  @Query(() => CategoryOutput)
  findCategoryBySlug(@Args('input') categoryInput: CategoryInput) {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => FindManyDishesOutput)
  findManyDishes() {
    return this.restaurantService.findManyDishes();
  }

  @Mutation(() => CreateDishOutput)
  @Role(['Owner'])
  createDish(
    @CurrentUser() owner: User,
    @Args('input') createDishInput: CreateDishInput,
  ) {
    return this.restaurantService.createDish(owner, createDishInput);
  }

  @Mutation(() => EditDishOutput)
  @Role(['Owner'])
  updateDish(
    @CurrentUser() owner: User,
    @Args('input') editDishInput: EditDishInput,
  ) {
    return this.restaurantService.updateDish(owner, editDishInput);
  }

  @Mutation(() => DeleteDishOutput)
  @Role(['Owner'])
  deleteDish(
    @CurrentUser() owner: User,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.restaurantService.deleteDish(owner, deleteDishInput);
  }
}
