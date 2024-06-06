import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Required field' })
  @MinLength(6, { message: 'OTP must have 6 characters.' })
  @MaxLength(6, { message: 'OTP must have 6 characters.' })
  @ApiProperty()
  otp: number;

  save: boolean;
}
