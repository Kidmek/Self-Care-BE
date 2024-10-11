import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UserDecorator } from 'src/common/user.decorator';
import { User } from '../users/entities/user.entity';
import { AnalyticField } from './entities/analytics.entity';

export type AnalyticDTO = Record<AnalyticField, number>;
@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@UserDecorator() user: User) {
    return this.analyticsService.findAll(user);
  }

  @Get(':year')
  @UseGuards(AuthGuard)
  findCustomersByYear(
    @Param('year') year: number,
    @UserDecorator() user: User,
  ) {
    return this.analyticsService.findByYear(year, user);
  }

  @UseGuards(AuthGuard)
  @Post()
  addAnalytic(
    @Body() addAnalyticsDtos: AnalyticDTO,
    @UserDecorator() user: User,
  ) {
    return this.analyticsService.addAnalytic(addAnalyticsDtos, user);
  }
}
