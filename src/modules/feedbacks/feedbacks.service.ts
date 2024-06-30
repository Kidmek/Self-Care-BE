import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

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

  async findAll(pageQueryDto: PageQueryDto) {
    const queryBuilder = this.feedbackRepostiory.createQueryBuilder('feedback');
    if (pageQueryDto.query) {
      const search = `%${pageQueryDto.query}%`;
      queryBuilder.where(
        'feedback.user.email LIKE :search OR feedback.user.username LIKE :search OR feedback.user.firstName LIKE :search OR feedback.user.lastName LIKE :search',
        { search },
      );
    }

    queryBuilder
      .orderBy('feedback.createdAt', pageQueryDto.order)
      .skip(pageQueryDto.skip)
      .take(pageQueryDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageQueryDto });

    return new PageDto(entities, pageMetaDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
