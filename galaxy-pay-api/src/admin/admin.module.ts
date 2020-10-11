import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Software } from 'src/common/entities/software.entity';
import { UserService } from './service/user.service';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './service/jwt-auth.guard';
import { JwtStrategy } from './service/jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { SoftwareService } from './service/software.service';
import { SoftwareController } from './controller/software.controller';
import { Trade } from 'src/common/entities/trade.entity';
import { TradeService } from './service/trade.service';
import { TradeController } from './controller/trade.controller';
import { FileController } from './controller/file.controller';
import { RefundTradeService } from './service/refund.trade.service';
import { RefundTrade } from 'src/common/entities/refund.trade.entity';
import { RefundController } from './controller/refund.controller';

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
