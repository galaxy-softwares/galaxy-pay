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
import { Order } from 'src/common/entities/order.entity';
import { OrderService } from './service/order.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Software, Order]),
    JwtModule.register({
        secretOrPrivateKey: '1AGy4bCUoECDZ4yI6h8DxHDwgj84EqStMNyab8nPChQ=',
        signOptions: {
          expiresIn: '12h'
        }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AuthController, SoftwareController],
  providers: [AuthService, SoftwareService, UserService, OrderService, JwtAuthGuard, JwtStrategy],
  exports: [SoftwareService, OrderService]
})
export class AdminModule {}
