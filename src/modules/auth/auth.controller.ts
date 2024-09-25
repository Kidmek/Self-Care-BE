import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Get,
  ParseBoolPipe,
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
import { LanguageGuard } from 'src/common/language.guard';
import { LanguageDec } from 'src/common/language.decorator';
import { Language } from 'src/config/constants';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: AuthReqDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @UseGuards(LanguageGuard)
  register(
    @Body() createUserDto: CreateUserDto,
    @LanguageDec() lang: Language,
  ) {
    return this.authService.register(createUserDto, lang);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  @UseGuards(LanguageGuard)
  validateOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @LanguageDec() lang: Language,
  ) {
    return this.authService.validateOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp,
      verifyOtpDto.save,
      verifyOtpDto.newEmail,
      lang,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  @UseGuards(LanguageGuard)
  sendOtp(
    @Query('email') emailOrPhone: string,
    @Query('isEmail', ParseBoolPipe) isEmail: boolean,
    @Query('register', ParseBoolPipe) register?: boolean,
    @Query('newEmail') newEmail?: string,
    @LanguageDec() lang?: Language,
  ) {
    return this.authService.sendOtp(
      isEmail,
      emailOrPhone,
      null,
      register,
      newEmail,
      lang,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-pass')
  @UseGuards(LanguageGuard)
  resetPass(
    @Query('emailOrPhone') emailOrPhone: string,
    @LanguageDec() lang: Language,
  ) {
    return this.authService.resetPassword(emailOrPhone, lang);
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-pass')
  @UseGuards(LanguageGuard)
  changePass(
    @Body() changePassOtpDto: ChangePassOtpDto,
    @LanguageDec() lang: Language,
  ) {
    const { email, password, otp } = changePassOtpDto;
    return this.authService.changePassword(email, password, otp, lang);
  }

  @HttpCode(HttpStatus.OK)
  @Post('new-pass')
  @UseGuards(AuthGuard)
  newPass(@UserDecorator() user: User, @Query('password') password: string) {
    return this.authService.newPass(user, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('new-email')
  @UseGuards(AuthGuard, LanguageGuard)
  newEmail(
    @UserDecorator() user: User,
    @Query('email') newEmail: string,
    @LanguageDec() lang: Language,
  ) {
    return this.authService.newEmail(user, newEmail, lang);
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
