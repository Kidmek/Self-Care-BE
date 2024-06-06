import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, MinLength } from 'class-validator';

export class AuthReqDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric('en-US', {
    message: 'Username does not allow other than alpha numeric chars.',
  })
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
