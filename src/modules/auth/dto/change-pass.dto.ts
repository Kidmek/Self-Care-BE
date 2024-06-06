import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePassOtpDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Required field' })
  @MinLength(6, { message: 'OTP must have 6 characters.' })
  @MaxLength(6, { message: 'OTP must have 6 characters.' })
  @ApiProperty()
  otp: number;

  // @IsNotEmptyObject()
  @IsNotEmpty({ message: 'Required field' })
  // @Matches(passwordRegEx, {
  //   message: `Password must contain Minimum 8 and maximum 20 characters,
  //   at least one uppercase letter,
  //   one lowercase letter,
  //   one number and
  //   one special character`,
  // })
  @MinLength(5, { message: 'Password must have atleast 5 characters.' })
  @ApiProperty()
  password: string;
}
