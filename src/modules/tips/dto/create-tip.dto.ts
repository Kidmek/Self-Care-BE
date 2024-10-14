import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TipType } from '../entities/tip.entity';

export class CreateTipDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Description required' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Amharic Description required' })
  amh_description: string;

  @ApiProperty()
  @IsNotEmpty()
  type: TipType;

  @ApiProperty()
  id: number;

  @ApiProperty()
  removedPictures: string;

  @ApiProperty()
  removedVideos: string;
}
