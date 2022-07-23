import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '../jwt/jwt.service';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

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

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // find the user with the email
    // check if the password is correct
    // make a JWT and give it to the user
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) return { ok: false, error: 'User not found' };
      const passwordCorrect = await this.checkPassword(password, user.password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }

      const token = this.jwtService.sign(user.id);

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async checkPassword(
    aPassword: string,
    checkPassword: string,
  ): Promise<boolean> {
    try {
      return await compare(aPassword, checkPassword);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
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
