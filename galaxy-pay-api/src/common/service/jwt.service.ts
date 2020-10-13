import { Injectable } from '@nestjs/common';
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';
import { GpaConfigService } from './config.service';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private gpaConfigService: GpaConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return this.gpaConfigService.get('jwt');
  }
}
