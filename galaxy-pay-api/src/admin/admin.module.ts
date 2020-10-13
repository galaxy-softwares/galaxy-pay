import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Software, Trade, RefundTrade } from './entities';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController, SoftwareController, TradeController, FileController, RefundController } from './controller';
import { AuthService, SoftwareService, UserService, TradeService,RefundTradeService, JwtAuthGuard, JwtStrategy } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Software, Trade, RefundTrade]),
    JwtModule.register({
        secretOrPrivateKey: '1AGy4bCUoECDZ4yI6h8DxHDwgj84EqStMNyab8nPChQ=',
        signOptions: {
          expiresIn: '12h'
        }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AuthController, SoftwareController, TradeController, FileController, RefundController],
  providers: [AuthService, SoftwareService, UserService, TradeService,RefundTradeService, JwtAuthGuard, JwtStrategy],
  exports: [SoftwareService, TradeService, RefundTradeService]
})
export class AdminModule {}
