import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytic } from './entities/analytics.entity';
import { Tip } from '../tips/entities/tip.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Analytic, Tip, Feedback]), UsersModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
