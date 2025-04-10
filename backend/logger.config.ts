import * as winston from 'winston';
import 'winston-daily-rotate-file';
export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
    }),
    new winston.transports.File({
      filename: './logs/app.log',
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: './logs/audit.log',
    }),
    new winston.transports.DailyRotateFile({
      dirname: './logs',
      filename: 'audit-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
    }),
  ],
};
