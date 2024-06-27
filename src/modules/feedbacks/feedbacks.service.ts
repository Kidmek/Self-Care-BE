import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepostiory: Repository<Feedback>,
    private userService: UsersService,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto, user: User) {
    user = await this.userService.findOneById(user.id);
    const feedback = new Feedback();
    feedback.feedback = createFeedbackDto.feedback;
    feedback.improvement = createFeedbackDto.improvement;
    feedback.user = user;
    return await this.feedbackRepostiory.save(feedback);
  }

  findAll() {
    return `This action returns all feedbacks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
