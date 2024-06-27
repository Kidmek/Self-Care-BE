import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @ApiProperty()
  improvement: string;

  @ApiProperty()
  feedback: string;
}
