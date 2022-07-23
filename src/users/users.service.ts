import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../../prisma/prisma.service';
import { CoreOutput } from '../common/dtos/output.dto';
import { JwtService } from '../jwt/jwt.service';
import { MailService } from '../mail/mail.service';
import { CreateAccountInput } from './dtos/create-account.dto';
import { EditProfileInputArgs } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount(args: CreateAccountInput): Promise<CoreOutput> {
    try {
      // check new user
      const exists = await this.prisma.user.findFirst({
        where: { email: args.data.email },
      });

      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }

      // hash password
      const newArgs = await this.hashPassword(args);

      const user = await this.prisma.user.create(newArgs);

      const verification = await this.prisma.verification.create({
        data: {
          code: uuidv4(),
          userId: user.id,
        },
      });

      // send vert. email
      this.mailService.sendVerificationEmail(user.email, verification.code);

      return { ok: true };
    } catch (e) {
      // make error
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    // find the user with the email
    // check if the password is correct
    // make a JWT and give it to the user
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
      });

      if (!user) return { ok: false, error: 'User not found' };
      const passwordCorrect = await this.checkPassword(password, user.password);
      if (!passwordCorrect) return { ok: false, error: 'Wrong password' };

      const token = this.jwtService.sign(user.id);

      return { ok: true, token };
    } catch (error) {
      return { ok: false, error: `Can't log user in.` };
    }
  }

  async editProfile(id: number, params: EditProfileInputArgs) {
    try {
      if (params.email) {
        params.verified = false;
      }
      const user = await this.prisma.user.update({
        where: { id },
        data: params,
      });

      const verification = await this.prisma.verification.create({
        data: {
          code: uuidv4(),
          userId: user.id,
        },
      });

      // send vert. email
      this.mailService.sendVerificationEmail(user.email, verification.code);

      return { ok: true };
    } catch (error) {
      console.log('error', error);
      return { ok: false, error: 'could not update profile' };
    }
  }

  async verifyEmail(code: any) {
    try {
      const verification = await this.prisma.verification.findFirst({
        where: { code },
        include: { user: true },
      });

      if (verification) {
        await this.prisma.user.update({
          where: { id: verification.userId },
          data: { verified: true },
        });

        await this.prisma.verification.delete({
          where: { id: verification.id },
        });

        return { ok: true };
      }
      return { ok: false, error: 'verification not found' };
    } catch (error) {
      return { ok: false, error: 'Could not verify email.' };
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

  async meFindById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (user) return { ok: true, user };
    } catch (error) {
      return { ok: false, error: 'no user found' };
    }
  }
}
