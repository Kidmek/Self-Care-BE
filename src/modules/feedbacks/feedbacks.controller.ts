import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserDecorator } from 'src/common/user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('feedbacks')
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
  findAll() {
    return this.feedbacksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbacksService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(+id);
  }
}
