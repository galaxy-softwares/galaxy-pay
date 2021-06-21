import { registerAs } from '@nestjs/config'

export default registerAs('logger', () => ({
  file: process.env.LOGGER_FILE,
  console: process.env.LOGGER_CONSOLE
}))
