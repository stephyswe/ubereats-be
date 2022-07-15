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
  getCats() {
    return this.catsService.findAll();
  }

  @Query(() => Cat, { name: 'cat' })
  async findOneById(@Args('id', ParseIntPipe) id: number): Promise<Cat> {
    return this.catsService.findOneById(id);
  }

  @Mutation(() => Cat, { name: 'createCat' })
  async create(@Args('createCatInput') args: CreateCatInput): Promise<Cat> {
    const createdCat = await this.catsService.create(args);
    pubSub.publish('catCreated', { catCreated: createdCat });
    return createdCat;
  }

  @Subscription(() => Cat)
  catCreated() {
    return pubSub.asyncIterator('catCreated');
  }
}
