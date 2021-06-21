import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PWD,
  database: process.env.DATABASE_DB,
  charset: process.env.DATABASE_CHARSET,
  synchronize: process.env.DATABASE_SYNCHRONIZE,
  entityPrefix: process.env.DATABASE_PREFIX,
  logging: process.env.DATABASE_LOG,
  logger: process.env.DATABASE_LOG_TYPE
}))
