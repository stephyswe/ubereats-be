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

    it('should return token if password correct', async () => {
      prisma.user.findFirst = jest.fn().mockReturnValueOnce(createArgs);
      service.checkPassword = jest.fn(() => Promise.resolve(true));

      const result = await service.login(loginArgs);

      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));

      expect(result).toEqual({ ok: true, token: 'signed-token-baby' });
    });

    it('should fail on exception', async () => {
      prisma.user.findFirst = jest.fn().mockRejectedValue('error');

      const result = await service.login(loginArgs);

      expect(result).toEqual({ ok: false, error: "Can't login user." });
    });
  });

  describe('findById', () => {
    const findByIdArgs = {
      id: 1,
    };
    it('should find an existing user', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(findByIdArgs);

      const result = await service.findById(1);

      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });

    it('should fail if no user is found', async () => {
      prisma.user.findUnique = jest.fn().mockRejectedValue('error');

      const result = await service.findById(1);

      expect(result).toEqual({ ok: false, error: 'User Not Found' });
    });
  });

  describe('editProfile', () => {
    it('should change email', async () => {
      const editProfileArgs = {
        id: 1,
        input: { email: 'bs@new.com' },
      };
      const newVerification = {
        code: 'code',
      };
      const newUser = {
        verified: false,
        email: editProfileArgs.input.email,
        id: editProfileArgs.id,
      };

      prisma.user.update = jest.fn().mockResolvedValue(newUser);

      prisma.verification.create = jest.fn().mockResolvedValue(newVerification);

      await service.editProfile(editProfileArgs.id, editProfileArgs.input);

      expect(prisma.user.update).toHaveBeenCalledTimes(1);

      expect(prisma.verification.create).toHaveBeenCalledWith({
        data: {
          code: expect.stringMatching(mockRegexUUID),
          userId: 1,
        },
      });

      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        newUser.email,
        newVerification.code,
      );
    });

    it('should fail on exception', async () => {
      prisma.user.update = jest.fn().mockRejectedValue('error');

      const result = await service.editProfile(1, { email: '12' });

      expect(result).toEqual({ ok: false, error: 'Could not update profile.' });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email', async () => {
      const mockedVerification = {
        user: {
          verified: false,
        },
        userId: 1,
        id: 10,
      };

      prisma.verification.findFirst = jest
        .fn()
        .mockResolvedValue(mockedVerification);
      prisma.user.update = jest.fn().mockResolvedValue({ id: '' });
      prisma.verification.delete = jest.fn();

      const result = await service.verifyEmail('');

      expect(prisma.verification.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.verification.findFirst).toHaveBeenCalledWith({
        include: { user: true },
        where: { code: '' },
      });

      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        data: { verified: true },
        where: { id: 1 },
      });

      expect(prisma.verification.delete).toHaveBeenCalledTimes(1);
      expect(prisma.verification.delete).toHaveBeenCalledWith({
        where: { id: 10 },
      });

      expect(result).toEqual({ ok: true });
    });

    it('should fail on verification not found', async () => {
      prisma.verification.findFirst = jest.fn().mockResolvedValue(undefined);

      const result = await service.verifyEmail('');

      expect(result).toEqual({ ok: false, error: 'Verification not found.' });
    });

    it('should fail on exception', async () => {
      prisma.verification.findFirst = jest.fn().mockRejectedValue('error');

      const result = await service.verifyEmail('');

      expect(result).toEqual({ ok: false, error: 'Could not verify email.' });
    });

    it.todo('userProfile');
    it.todo('me');
  });
});
