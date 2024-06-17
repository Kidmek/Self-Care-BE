import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthReqDto } from './dto/auth-req.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ChangePassOtpDto } from './dto/change-pass.dto';
import { AuthGuard } from './auth.guard';
import { User } from '../users/entities/user.entity';
import { UserDecorator } from 'src/common/user.decorator';

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
      verifyOtpDto.newEmail,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  sendOtp(
    @Query('username') username: string,
    @Query('register') register?: boolean,
    @Query('newEmail') newEmail?: string,
  ) {
    const user = new User();
    user.email = newEmail;
    return this.authService.sendOtp(
      username,
      user.email ? user : null,
      register,
    );
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

  @HttpCode(HttpStatus.OK)
  @Post('new-pass')
  @UseGuards(AuthGuard)
  newPass(@UserDecorator() user: User, @Query('password') password: string) {
    return this.authService.newPass(user, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('new-email')
  @UseGuards(AuthGuard)
  newEmail(@UserDecorator() user: User, @Query('email') newEmail: string) {
    return this.authService.newEmail(user, newEmail);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('self')
  getSelf(@UserDecorator() user: User) {
    return this.authService.getSelf(user);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('checkPassword')
  checkPassword(
    @UserDecorator() user: User,
    @Query('password') password: string,
  ) {
    return this.authService.checkPassword(user, password);
  }
}
