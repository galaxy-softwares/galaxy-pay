import { Injectable, Scope, Inject } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston'
import { Logger } from 'winston'
import { hex } from 'chalk'
import * as stacktrace from 'stacktrace-js'
import * as path from 'path'

@Injectable({ scope: Scope.REQUEST })
export class LoggerService extends WinstonLogger {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly winston: Logger) {
    super(winston)
  }

  info(message: any): void {
    super.log(message)
  }

  warn(message: any): void {
    super.warn(message)
  }

  error(message: any, trace?: string): void {
    super.error(message, trace)
  }

  debug?(message: any): void {
    super.debug(message)
  }

  verbose?(message: any): void {
    super.verbose(message)
  }

  /**
   * Http请求信息处理
   * @param status
   * @param logFormat
   */
  http(status, logFormat): void {
    // 根据状态码，进行日志类型区分
    if (status >= 500) {
      this.error(`${hex('#e50048')(status)} ` + logFormat)
    } else if (status >= 400) {
      this.warn(`${hex('#e4e700')(status)} ` + logFormat)
    } else {
      this.info(`${hex('#00c358')(status)} ` + logFormat)
    }
  }

  /**
   * 异常报错
   * @param data
   * @param req
   * @param error
   */
  exception(status, data, req, error: any): void {
    // 限制错误堆栈行数
    Error.captureStackTrace(this, error)
    Error.stackTraceLimit = 1

    const logFormat = `${req.method} 请求地址: ${req.originalUrl} 请求IP: ${req.ip}\n 响应内容: ${JSON.stringify(
      data
    )}\n 错误信息: ${hex('#e50048')(error.stack.split('at ')[1])}`

    this.error(`${hex('#e50048')(status)} ` + logFormat, error)
  }

  /**
   * 日志追踪，可以追溯到哪个文件、第几行第几列
   * @param deep
   */
  private getStackTrace(deep = 2): string {
    const stackList: stacktrace.StackFrame[] = stacktrace.getSync()
    const stackInfo: stacktrace.StackFrame = stackList[deep]

    const lineNumber: number = stackInfo.lineNumber
    const columnNumber: number = stackInfo.columnNumber
    const fileName: string = stackInfo.fileName
    const basename: string = path.basename(fileName)
    return `${basename} (line: ${lineNumber}, column: ${columnNumber}): \n`
  }
}
