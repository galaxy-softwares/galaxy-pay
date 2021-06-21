import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { GpaConfigService } from './config.service'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private gpaConfigService: GpaConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...this.gpaConfigService.get('database'),
      autoLoadEntities: true,
      keepConnectionAlive: true
    }
  }
}
