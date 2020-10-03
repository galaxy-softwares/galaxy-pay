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
import { OrderController } from './controller/trade.controller';
import { FileController } from './controller/file.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Software, Trade]),
    JwtModule.register({
        secretOrPrivateKey: '1AGy4bCUoECDZ4yI6h8DxHDwgj84EqStMNyab8nPChQ=',
        signOptions: {
          expiresIn: '12h'
        }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AuthController, SoftwareController, OrderController, FileController],
  providers: [AuthService, SoftwareService, UserService, TradeService, JwtAuthGuard, JwtStrategy],
  exports: [SoftwareService, TradeService]
})
export class AdminModule {}
