import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class AuthReqDto {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

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
