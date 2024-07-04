import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, UserRole } from '../entities/user.entity';
import { Constants } from 'src/config/constants';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @Matches(Constants.phoneRegEx, {
    message: 'Please provide a valid Phone',
  })
  @ApiProperty()
  phone: string;

  @ApiProperty()
  birthDate?: Date;

  @ApiProperty()
  role?: UserRole;

  @ApiProperty()
  id?: number;

  @IsString()
  @IsEnum(Gender, { message: 'Must be either Female or Male' })
  @ApiProperty()
  gender: Gender;

  @IsNotEmpty()
  @MinLength(5, { message: 'Password must have atleast 5 characters.' })
  @ApiProperty()
  password: string;
}
