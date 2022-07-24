import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { CoreInputId } from '../../common/dtos/output.dto';
import { Restaurant } from '../../restaurants/models/restaurant.model';

export enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
export class User extends CoreInputId {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  role: UserRole;

  @Field(() => Boolean)
  verified?: boolean;

  @Field(() => [Restaurant])
  restaurants: Restaurant[];
}
