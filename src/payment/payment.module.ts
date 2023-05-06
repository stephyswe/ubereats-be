import { Module } from '@nestjs/common';

import { PrismaService } from '../common/prisma.service';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  providers: [PrismaService, PaymentService, PaymentResolver],
})
export class PaymentModule {}
