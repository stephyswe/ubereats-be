import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
