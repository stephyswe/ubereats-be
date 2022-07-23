import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountInput } from './dtos/create-account.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createAccount(
    args: CreateAccountInput,
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      // check new user
      const exists = await this.prisma.user.findUnique({
        where: { email: args.data.email },
      });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }

      // hash password
      const newArgs = await this.hashPassword(args);

      await this.prisma.user.create(newArgs);
      return { ok: true };
    } catch (e) {
      // make error
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async hashPassword(args: CreateAccountInput): Promise<CreateAccountInput> {
    try {
      const hashedPassword = await hash(args.data.password, 10);
      args.data.password = hashedPassword;
      return args;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
