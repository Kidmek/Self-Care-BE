import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { UsersModule } from '../users/users.module';
import { TipsModule } from '../tips/tips.module';
import { FeedbacksModule } from '../feedbacks/feedbacks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytic } from './entities/analytics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analytic]),
    UsersModule,
    TipsModule,
    FeedbacksModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
