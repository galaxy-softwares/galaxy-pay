import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

@Injectable()
export class GpaConfigService {
  constructor(private configService: ConfigService) {}

  get<T = any>(propertyPath: string, defaultValue?: T): T {
    return this.configService.get(propertyPath, defaultValue)
  }

  get envConfig(): dotenv.DotenvParseOutput {
    return dotenv.parse(fs.readFileSync('.env'))
  }

  get port(): number {
    return this.configService.get('database.port')
  }

  /**
   * JWT密钥
   */
  get jwtSecret(): string | Buffer {
    return this.configService.get('jwt.secret')
  }
}
