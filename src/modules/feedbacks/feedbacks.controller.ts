import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserDecorator } from 'src/common/user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { PageQueryDto } from 'src/common/dto/page-query.dto';

@Controller('feedbacks')
@ApiTags('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @UserDecorator() user: User,
  ) {
    return this.feedbacksService.create(createFeedbackDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() pageQueryDto: PageQueryDto, @UserDecorator() user: User) {
    return this.feedbacksService.findAll(pageQueryDto, user);
  }
}
