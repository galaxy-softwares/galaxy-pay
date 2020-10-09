import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './common/entities/user.entity';
import { Software } from './common/entities/software.entity';
import { ApiModule } from './api/api.module';
import { PayModule } from './pay/pay.module';
import { Trade } from './common/entities/trade.entity';
import { RefundTrade } from './common/entities/refund.trade.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [User, Software, Trade, RefundTrade],
      synchronize: true,  
      charset: 'UTF8_GENERAL_CI',
    }),
    AdminModule,
    CommonModule,
    PayModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
