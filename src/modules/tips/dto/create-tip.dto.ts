import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { TipType } from '../entities/tip.entity';

export class CreateTipDto {
  @MaxLength(40, { message: 'Title must not be longer than 40 characters.' })
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @MaxLength(40, { message: 'Title must not be longer than 40 characters.' })
  @IsNotEmpty()
  @ApiProperty()
  amh_title: string;

  @ApiProperty()
  amh_description: string;

  @ApiProperty()
  @IsNotEmpty()
  type: TipType;

  @ApiProperty()
  id: number;
}
