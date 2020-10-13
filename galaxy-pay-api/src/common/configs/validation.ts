import * as Joi from '@hapi/joi';

export const schema = Joi.object({
  // 开发环境
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test', 'prov').default('dev'),
  PORT: Joi.number().default(3000),

  // 默认数据库
  DATABASE_TYPE: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PWD: Joi.string().required(),
  DATABASE_DB: Joi.string().required(),
  DATABASE_PREFIX: Joi.string().default(''),
  DATABASE_CHARSET: Joi.string().default('UTF8_GENERAL_CI'),
  DATABASE_LOG: Joi.boolean(),
  DATABASE_LOG_TYPE: Joi.string(),
  DATABASE_SUBSCRIBERS: Joi.string(),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(true),
  DATABASE_DROPSCHEMA: Joi.boolean().default(false),

  // 日志
  LOGGER_FILE: Joi.boolean().default(false),
  LOGGER_CONSOLE: Joi.boolean().default(true),
});

export const options = {
  allowUnknown: true, // 控制是否在环境变量中允许未知键。默认是true
  abortEarly: true, // 如果为true，则在第一个错误时停止验证；如果为false，则返回所有错误。默认为false
};
