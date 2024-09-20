import { Injectable, LoggerService } from '@nestjs/common';
import { logger } from './logger';

@Injectable()
export class CustomLogger implements LoggerService {
  log(message: string) {
    logger.info(message); // Log info level
  }
  error(message: string, trace: string) {
    logger.error(`${message} - ${trace}`); // Log error level
  }
  warn(message: string) {
    logger.warn(message); // Log warning level
  }
  debug(message: string) {
    logger.debug(message); // Log debug level
  }
  verbose(message: string) {
    logger.verbose(message); // Log verbose level
  }
}
