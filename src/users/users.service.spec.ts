/* eslint-disable @typescript-eslint/no-namespace */
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '../jwt/jwt.service';
import { MailService } from '../mail/mail.service';
import { UsersService } from './users.service';

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token-baby'),
  verify: jest.fn(),
});

const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});

const mockRegexUUID =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

describe('UsersService', () => {
  let service: UsersService;
  let mailService: MailService;
  let jwtService: JwtService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
        ConfigService,
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    //Get a reference to the module's `PrismaService` and save it for usage in our tests.
    prisma = module.get<PrismaService>(PrismaService);
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      id: 1,
      email: 'test@email.com',
      password: '',
      role: UserRole.Client,
    };

    it('should fail if user exists', async () => {
      prisma.user.findFirst = jest
        .fn()
        .mockReturnValueOnce({ id: 1, email: 'test@email.com' });

      const result = await service.createAccount({ data: createAccountArgs });
      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that email already',
      });
    });

    it('should create a new user', async () => {
      prisma.user.findFirst = jest.fn().mockReturnValueOnce(undefined);
      prisma.user.create = jest.fn().mockReturnValueOnce(createAccountArgs);
      prisma.verification.create = jest
        .fn()
        .mockReturnValueOnce({ code: 'code' });

      const result = await service.createAccount({ data: createAccountArgs });

      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@email.com' },
      });

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createAccountArgs,
      });

      expect(prisma.verification.create).toHaveBeenCalledTimes(1);
      expect(prisma.verification.create).toHaveBeenCalledWith({
        data: {
          code: expect.stringMatching(mockRegexUUID) && expect.any(String), // expect.any(String)
          userId: 1,
        },
      });

      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        'test@email.com',
        'code', //expect.any(String),
      );

      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      prisma.user.findFirst = jest.fn().mockRejectedValue('error');

      const result = await service.createAccount({ data: createAccountArgs });
      expect(result).toEqual({ ok: false, error: "Couldn't create account" });
    });
  });

  describe('login', () => {
    const createArgs = { id: 1, email: 'test@email.com' };
    const loginArgs = {
      email: 'bs@email.com',
      password: 'bs.password',
    };

    it('should fail if user does not exist', async () => {
      prisma.user.findFirst = jest.fn().mockReturnValueOnce(undefined);

      const result = await service.login(loginArgs);

      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'bs@email.com' },
      });
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail if the password is wrong', async () => {
      prisma.user.findFirst = jest.fn().mockReturnValueOnce(createArgs);
      service.checkPassword = jest.fn(() => Promise.resolve(false));

      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: 'Wrong password' });
    });
  });
});
