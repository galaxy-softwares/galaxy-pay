import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from '../service/logger.service';
import { TimeUtil } from '../utils/time.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private timeUtil: TimeUtil, private loggerService: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const data = {
      code: status,
      path: req.url,
      error: exception.message,
      time: this.timeUtil.CurrentTime,
    };

    this.loggerService.setContext(AllExceptionsFilter.name);
    this.loggerService.exception(status, data, req, exception);
  }
}
