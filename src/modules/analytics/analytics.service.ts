import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { In, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { Tip } from '../tips/entities/tip.entity';
import { TotalAnalytics } from './dto/total-analytics.dto';
import { Analytic, AnalyticField } from './entities/analytics.entity';
import { AnalyticDTO } from './analytics.controller';
import { UsersService } from '../users/users.service';

enum AnalyticName {
  USER = 'User',
  FEEDBACK = 'Feedback',
  TIP = 'Tip',
  CUSTOMER = 'Customer',
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
    private usersService: UsersService,
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

  async findAll(user: User) {
    this.usersService.checkPrivilage(user);
    const totalList: TotalAnalytics[] = [];
    const totalUsers: TotalAnalytics[] = await this.userRepository
      .createQueryBuilder('users')
      .select('users.role', 'name')
      .addSelect('COUNT(users.id)', 'count')
      .groupBy('users.role')
      .getRawMany();
    const totalCustomersByGender = await this.userRepository
      .createQueryBuilder('users')
      .select('users.gender', 'name')
      .addSelect('COUNT(users.id)', 'count')
      .where({
        role: 'customer',
      })
      .groupBy('users.gender')
      .getRawMany();
    const totalUsersByStatus = await this.userRepository
      .createQueryBuilder('users')
      .select('users.isActive', 'name')
      .addSelect('COUNT(users.id)', 'count')
      .where({
        role: Not('customer'),
      })
      .groupBy('users.isActive')
      .getRawMany();

    const totalUsersByRole = await this.userRepository
      .createQueryBuilder('users')
      .select('users.role', 'name')
      .addSelect('COUNT(users.id)', 'count')
      .where({
        role: Not('customer'),
      })
      .groupBy('users.role')
      .getRawMany();

    // const totalCustomersByAge = this.userRepository.query(`
    //         SELECT
    //             CASE
    //                 WHEN age BETWEEN 0 AND 20 THEN 'Below 20'
    //                 WHEN age BETWEEN 21 AND 30 THEN '21-30'
    //                 WHEN age BETWEEN 31 AND 40 THEN '31-40'
    //                 WHEN age BETWEEN 41 AND 50 THEN '41-50'
    //                 WHEN age BETWEEN 51 AND 60 THEN '51-60'
    //                 WHEN age BETWEEN 61 AND 70 THEN '61-70'
    //                 ELSE 'Above 70'
    //             END AS AgeRange,
    //             COUNT(*) AS Count
    //         FROM
    //             (SELECT EXTRACT(YEAR FROM AGE(CURRENT_DATE, "birthDate")) AS age FROM users where role = 'customer') as ages
    //         GROUP BY AgeRange
    //     `);
    const totalFeedback = await this.feedbackRepository.count();
    const totalSavedAnalytic = await this.analyticRepository.find();
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

    const res = {
      totalList: totalList.reduce((res, item) => {
        res[item.name] = item.count;
        return res;
      }, {}),
      doughnutStat: {
        totalCustomersByGender,
        totalSavedAnalytic,
        totalUsersByStatus,
        // totalCustomersByAge,
        totalUsersByRole,
      },
    };

    return res;
  }

  async findByYear(year: number, user: User) {
    this.usersService.checkPrivilage(user);

    const totalList: TotalAnalytics[] = [];

    const years = await this.userRepository
      .createQueryBuilder('user')
      .select('EXTRACT(YEAR FROM user.createdAt)', 'year')
      .distinct(true)
      .orderBy('year', 'ASC')
      .getRawMany();

    const customers = await this.userRepository
      .createQueryBuilder('user')
      .select('EXTRACT(MONTH FROM user.createdAt)', 'name')
      .addSelect('COUNT(*)', 'count')
      .where({
        role: 'customer',
      })
      .groupBy('EXTRACT(MONTH FROM user.createdAt)')
      .addGroupBy('EXTRACT(YEAR FROM user.createdAt)')
      .having('EXTRACT(YEAR FROM user.createdAt) = :year', { year })
      .getRawMany();

    customers.forEach((t) => {
      totalList.push(
        new TotalAnalytics(`${AnalyticName.CUSTOMER} ${t.name}`, t.count),
      );
    });

    const res = {
      data: totalList,
      years,
    };

    return res;
  }
}
