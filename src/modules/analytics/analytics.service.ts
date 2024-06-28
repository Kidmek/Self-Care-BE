import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { Tip } from '../tips/entities/tip.entity';
import { TotalAnalytics } from './dto/total-analytics.dto';
import { Analytic, AnalyticField } from './entities/analytics.entity';
import { AnalyticDTO } from './analytics.controller';

enum AnalyticName {
  USER = 'User',
  FEEDBACK = 'Feedback',
  TIP = 'Tip',
}
@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytic)
    private analyticRepository: Repository<Analytic>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Tip)
    private tipRepository: Repository<Tip>,
  ) {}

  async addAnalytic(addAnalyticsDtos: AnalyticDTO, user: User) {
    const types = Object.keys(addAnalyticsDtos) as AnalyticField[];

    console.log(
      `User ${user.id} added analytics with types: ${types.join(', ')}`,
    );

    // Use the 'In' operator to find analytics where 'name' is in the list of types
    const existingAnalytics = await this.analyticRepository.find({
      where: {
        name: In(types),
      },
    });

    // Map existing analytics by name for quick lookup
    const existingAnalyticsMap = new Map(
      existingAnalytics.map((analytic) => [analytic.name, analytic]),
    );

    // Filter out types that already exist and create new Analytic objects for missing ones
    const newAnalytics = types
      .filter((type) => !existingAnalyticsMap.has(type))
      .map((type) => {
        const newAnalytic = new Analytic();
        newAnalytic.name = type;
        newAnalytic.amount = 0;
        // Set other properties if needed, perhaps related to `user`
        return newAnalytic;
      });

    // Combine existing analytics (possibly updated) and new analytics
    const allAnalyticsToSave = existingAnalytics
      .concat(newAnalytics)
      .map((a) => {
        console.log('Prev amount', a.amount);
        console.log('Amount type', typeof a.amount);
        console.log('New Amount', addAnalyticsDtos[a.name]);
        // @ts-expect-error its always a number
        a.amount = parseInt(a.amount) + addAnalyticsDtos[a.name];
        console.log('New Added', a.amount);
        return a;
      });
    await this.analyticRepository.save(allAnalyticsToSave);
    return 'Saved';
  }

  async findAll() {
    const totalList: TotalAnalytics[] = [];
    const totalUsers: TotalAnalytics[] = await this.userRepository
      .createQueryBuilder('users')
      .select('users.role', 'name')
      .addSelect('COUNT(users.id)', 'count')
      .groupBy('users.role')
      .getRawMany();
    const totalFeedback = await this.feedbackRepository.count();
    const totalTips: TotalAnalytics[] = await this.tipRepository
      .createQueryBuilder('tip')
      .select('tip.type', 'name')
      .addSelect('COUNT(tip.id)', 'count')
      .groupBy('tip.type')
      .getRawMany();

    totalUsers.forEach((t) => {
      totalList.push(
        new TotalAnalytics(`${AnalyticName.USER} ${t.name}`, t.count),
      );
    });
    totalTips.forEach((t) => {
      totalList.push(
        new TotalAnalytics(`${AnalyticName.TIP} ${t.name}`, t.count),
      );
    });

    totalList.push(new TotalAnalytics(AnalyticName.FEEDBACK, totalFeedback));

    return totalList.reduce((res, item) => {
      res[item.name] = item.count;
      return res;
    }, {});
  }
}
