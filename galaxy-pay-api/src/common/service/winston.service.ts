import { Injectable } from '@nestjs/common';
import { WinstonModuleOptionsFactory, WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';
import { bgHex, hex } from 'chalk';
import 'winston-daily-rotate-file';
import * as dateFns from 'date-fns';
import * as path from 'path';
import { CONSOLE_BOTTOM_LINE, CONSOLE_TOP_LINE } from '../constants/symbol';

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  // config = dotenv.parse(fs.readFileSync('.env'));
  private dailyRotateFileOption = {
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD',
    maxSize: '10m',
    maxFiles: '30d',
    json: false,
    silent: false,
  };
  constructor() {}

  createWinstonModuleOptions(): WinstonModuleOptions {
    return {
      exitOnError: false,
      handleExceptions: true,
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.prettyPrint(),
        format.ms(),
      ),
      transports: [
        new transports.DailyRotateFile({
          ...this.dailyRotateFileOption,
          level: 'info',
          auditFile: path.join(
            __dirname,
            '..',
            'logs',
            `${dateFns.format(new Date(), 'yyyy-MM-dd')}-success.json`,
          ),
          filename: `%DATE%-success.log`,
        }),
        new transports.DailyRotateFile({
          ...this.dailyRotateFileOption,
          level: 'warn',
          auditFile: path.join(
            __dirname,
            '..',
            'logs',
            `${dateFns.format(new Date(), 'yyyy-MM-dd')}-warn.json`,
          ),
          filename: `%DATE%-warn.log`,
        }),
        new transports.Console({
          silent: false,
          format: format.combine(
            format.printf((info) => {
              let color: string;
              let level: string;

              switch (info.level) {
                case 'info':
                  color = '#00c358';
                  level = ' Info  ';
                  break;
                case 'warn':
                  color = '#e4e700';
                  level = ' Warn  ';
                  break;
                case 'error':
                  color = '#e50048';
                  level = ' Error ';
                  break;
              }

              // 信息格式处理
              const message =
                hex(color)(CONSOLE_TOP_LINE) + info.message + hex(color)(CONSOLE_BOTTOM_LINE);

              return `${bgHex(color).hex('#000000').bold(level)} ${hex('#2196F3')(
                info.timestamp,
              )} ${hex('#e4e700')('[' + info.context + ']')} ${hex('#e4e700')(
                info.ms,
              )}: \n${message}`;
            }),
          ),
        }),
      ],
    };
  }
}
