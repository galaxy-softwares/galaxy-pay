import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, Software, Trade, Merchant } from './entities';
import { AuthController, SoftwareController, TradeController, FileController } from './controller';
import {
  AuthService,
  SoftwareService,
  UserService,
  TradeService,
  JwtAuthGuard,
  JwtStrategy,
} from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Software, Trade, Merchant]),
    JwtModule.register({
      secretOrPrivateKey: '1AGy4bCUoECDZ4yI6h8DxHDwgj84EqStMNyab8nPChQ=',
      signOptions: {
        expiresIn: '12h',
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController, SoftwareController, TradeController, FileController],
  providers: [AuthService, SoftwareService, UserService, TradeService, JwtAuthGuard, JwtStrategy],
  exports: [SoftwareService, TradeService],
})
export class AdminModule {}
