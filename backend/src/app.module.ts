import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    AuthModule, PrismaModule, WalletModule],
  controllers: [UserController]
})
export class AppModule {}
