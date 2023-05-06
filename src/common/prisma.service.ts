import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

/**
 * Extension of the PrismaClient for use with NestJs.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    /**
     * Get the database url from environmental variables and pass it in.
     */
    super({
      datasources: {
        db: {
          url: configService.get('POSTGRES_URL'),
        },
      },
    });
  }

  /**
   * Connect to the database when the module is initialized.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnect from the database when the application is shutting down.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
      await this.$disconnect();
    });
  }
}
