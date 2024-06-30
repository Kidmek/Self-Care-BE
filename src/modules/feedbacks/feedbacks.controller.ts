import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
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
  findAll(@Query() pageQueryDto: PageQueryDto) {
    return this.feedbacksService.findAll(pageQueryDto);
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
