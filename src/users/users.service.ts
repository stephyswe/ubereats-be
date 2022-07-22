import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountInput } from './dtos/create-account.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createAccount(args: CreateAccountInput): Promise<string | undefined> {
    try {
      // check new user
      const exists = await this.prisma.user.findUnique({
        where: { email: args.data.email },
      });
      if (exists) {
        return 'There is a user with that email already';
      }
      await this.prisma.user.create(args);
    } catch (e) {
      // make error
      return `Couldn't create account, ${e}`;
    }
    // hash password
  }
}
