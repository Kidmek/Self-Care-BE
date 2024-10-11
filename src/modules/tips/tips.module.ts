import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';
import { Tip } from './entities/tip.entity';
import { Media } from './entities/media.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tip, Media]), UsersModule],
  controllers: [TipsController],
  providers: [TipsService],
  exports: [TypeOrmModule],
})
export class TipsModule {}
