import { Prisma } from '@prisma/client';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { Cat } from './models/cat.model';
import { CatsGuard } from './cat.guard';
import { CatsService } from './cats.service';
import { CreateCatInput } from './dto/create-cat.input';

const pubSub = new PubSub();

@Resolver(() => Cat)
export class CatsResolver {
  constructor(private readonly catsService: CatsService) {}

  @Query(() => [Cat], { name: 'cats' })
  @UseGuards(CatsGuard)
  async getCats(): Promise<Cat[]> {
    return this.catsService.findMany();
  }

  @Query(() => Cat, { name: 'cat' })
  async findOne(@Args('id', ParseIntPipe) id: number): Promise<Cat> {
    return this.catsService.findOne({ id });
  }

  @Mutation(() => Cat, { name: 'createCat' })
  async create(
    @Args('createCatInput') createCatInput: CreateCatInput,
  ): Promise<Cat> {
    const createdCat = await this.catsService.create(createCatInput);
    pubSub.publish('catCreated', { catCreated: createdCat });
    return createdCat;
  }

  @Subscription(() => Cat)
  catCreated() {
    return pubSub.asyncIterator('catCreated');
  }
}
