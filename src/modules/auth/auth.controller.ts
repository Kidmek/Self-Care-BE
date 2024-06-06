import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthReqDto } from './dto/auth-req.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ChangePassOtpDto } from './dto/change-pass.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: AuthReqDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  validateOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.validateOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp,
      verifyOtpDto.save,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  sendOtp(
    @Query('username') username: string,
    @Query('register') register?: boolean,
  ) {
    return this.authService.sendOtp(username, null, register);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-pass')
  resetPass(@Query('email') email: string) {
    return this.authService.resetPassword(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-pass')
  changePass(@Body() changePassOtpDto: ChangePassOtpDto) {
    const { email, password, otp } = changePassOtpDto;
    return this.authService.changePassword(email, password, otp);
  }
}
