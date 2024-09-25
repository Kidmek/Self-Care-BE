import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Constants } from './config/constants';
import * as morgan from 'morgan';
import { ensureDirectoryExists } from './config/utils';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import { config } from 'dotenv';
import { logger } from './config/logger';
import { CustomLogger } from './config/custom.logger';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  if (process.env.LOCAL !== 'true') {
    // Override console.log to also write to the file
    console.log = (message: any, ...optionalParams: any[]) => {
      logger.info(message, ...optionalParams);
    };
    console.error = (message: any, ...optionalParams: any[]) => {
      logger.error(message, ...optionalParams);
    };

    console.warn = (message: any, ...optionalParams: any[]) => {
      logger.warn(message, ...optionalParams);
    };

    console.debug = (message: any, ...optionalParams: any[]) => {
      logger.debug(message, ...optionalParams);
    };
    app.useLogger(app.get(CustomLogger));
  }
  ensureDirectoryExists(`./${Constants.uploadDir}/pictures`).catch();
  ensureDirectoryExists(`./${Constants.uploadDir}/videos`).catch();

  const dataSource = app.get(DataSource);
  runSeeders(dataSource)
    .then((seeds) => {
      seeds.forEach((s) => {
        console.log('Created ', s.name, s.result);
      });
    })
    .catch((err) => {
      console.log('Error seeding data');
      console.log(err);
    });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle(Constants.name)
    .setDescription(Constants.description)
    .setVersion(Constants.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalPipes(new ValidationPipe());
  if (process.env.LOCAL !== 'true') {
    app.use(
      morgan('tiny', {
        stream: {
          write: (message: string) => logger.info(message.trim()), // Redirect Morgan logs to Winston
        },
      }),
    );
  } else {
    app.use(morgan('dev'));
  }
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
