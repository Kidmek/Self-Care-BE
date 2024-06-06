import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Constants } from './config/constants';
import * as morgan from 'morgan';
import { ensureDirectoryExists } from './config/utils';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  ensureDirectoryExists(`./${Constants.uploadDir}/pictures`);
  ensureDirectoryExists(`./${Constants.uploadDir}/videos`);

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

  const config = new DocumentBuilder()
    .setTitle(Constants.name)
    .setDescription(Constants.description)
    .setVersion(Constants.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('tiny'));
  await app.listen(3000);
}

bootstrap();
