import { ApiProperty } from '@nestjs/swagger';
import { AnalyticField } from '../entities/analytics.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddAnalyticsDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber({}, { each: true })
  //   @ts-expect-error ignore
  [key in AnalyticField]: number;
}
