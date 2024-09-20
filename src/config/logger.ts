import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

// Set up daily rotating file transport for Winston
const transport = new transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// Create Winston logger instance
export const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    transport, // Log to files
    new transports.Console(), // Log to console as well
  ],
});
