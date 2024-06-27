import configuration from './config/configuration';
import emailConfiguration from './config/email.configuration';
import { dataSourceOptions } from './config/db.configuration';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { TipsModule } from './modules/tips/tips.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: './uploads',
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, emailConfiguration],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    EmailModule,
    TipsModule,
    FeedbacksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
