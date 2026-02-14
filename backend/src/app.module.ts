import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { WalletModule } from './wallet/wallet.module';
import { PaymentModule } from './payment/payment.module';
import { TransferModule } from './transfer/transfer.module';
import { AdminModule } from './admin/admin.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    AuthModule, PrismaModule, WalletModule, PaymentModule, TransferModule, AdminModule, TransactionModule],
  controllers: [UserController]
})
export class AppModule {}
