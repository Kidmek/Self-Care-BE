import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../email/email.service';
import { getSecondsDiff } from 'src/config/utils';
import { Constants } from 'src/config/constants';
import { classToPlain } from 'class-transformer';
import { AuthReqDto } from './dto/auth-req.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async getSelf(user: User) {
    return classToPlain(await this.usersService.findOneById(user.id));
  }
  async createToken(user: User): Promise<string> {
    const payload = { id: user.id, email: user.email };
    return await this.jwtService.signAsync(payload);
  }

  async checkPassword(user: User, password: string) {
    user = await this.usersService.findOneById(user.id);
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Wrong password');
    }
  }

  async signIn(signInDto: AuthReqDto): Promise<any> {
    const { password: pass, username: emailOrPhone } = signInDto;
    const user = await this.usersService.findOneByEmailOrPhone(emailOrPhone);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch: boolean = bcrypt.compareSync(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    if (user.role === UserRole.CUSTOMER) {
      if (signInDto.admin) {
        throw new UnauthorizedException();
      }
    } else {
      if (!user.isActive) {
        throw new BadRequestException('Inactive contact admin');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, otp, ...rest } = user;

    return {
      user: rest,
      token: rest.isActive ? await this.createToken(user) : null,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    if (await this.usersService.findOneByEmail(createUserDto.email)) {
      throw new BadRequestException('Email taken');
    }
    if (await this.usersService.findOneByPhone(createUserDto.phone)) {
      throw new BadRequestException('Phone taken');
    }

    let user: User = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.birthDate = createUserDto.birthDate;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.gender = createUserDto.gender;
    user.phone = createUserDto.phone.slice(-9);
    user = await this.usersRepository.save(user);
    // const token =  await this.createToken(user);
    const isEmailSent = await this.sendOtp(true, null, user, true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, otp: savedOtp, ...rest } = user;

    if (!isEmailSent) {
      throw new BadRequestException('Unable to send verification code');
    }
    return {
      user: rest,
      // token,
      isEmailSent,
    };
  }

  async resetPassword(emailOrPhone: string): Promise<any> {
    const user = await this.usersService.findOneByEmailOrPhone(emailOrPhone);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isEmailSent = await this.sendOtp(false, null, user);

    return {
      isEmailSent,
    };
  }

  async changePassword(email: string, password: string, otp: number) {
    const user = await this.usersService.findOneByEmailOrPhone(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (
      getSecondsDiff(user.otpSentAt, new Date()) <
      Constants.otpExpire * 60 * 60
    ) {
      if (user.otp == otp) {
        user.password = await bcrypt.hash(password, 10);
        user.otp = null;
        this.usersRepository.save(user);
        return true;
      } else {
        throw new BadRequestException('Incorrect Code');
      }
    } else {
      return new BadRequestException('OTP expired');
    }
  }

  async validateOtp(
    email: string,
    otp: number,
    save?: boolean,
    newEmail?: string,
  ) {
    const user = await this.usersService.findOneByEmailOrPhone(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (
      user.otpSentAt &&
      getSecondsDiff(user.otpSentAt, new Date()) < Constants.otpExpire * 60 * 60
    ) {
      if (user.otp == otp) {
        if (save !== false) {
          user.otp = null;
          user.isActive = true;
          user.email = newEmail;
          this.usersRepository.save(user);
        }
        return true;
      } else {
        throw new BadRequestException('Incorrect Code');
      }
    } else {
      return new BadRequestException('OTP expired');
    }
  }

  async sendOtp(
    isEmail: boolean,
    emailOrPhone?: string,
    user?: User,
    register?: boolean,
    newEmail?: string,
  ) {
    if (!user) {
      if (!emailOrPhone) {
        throw new BadRequestException('Email or Phone Required');
      }
      user = await this.usersService.findOneByEmailOrPhone(emailOrPhone);
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (
      user.otpSentAt &&
      getSecondsDiff(user.otpSentAt, new Date()) < Constants.otpResend * 60
    ) {
      throw new BadRequestException('OTP resend time not reached');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpSentAt = new Date();
    console.log('OTP', otp);
    const isOtpSent = !register
      ? await this.emailService.forgotPasswordEmail(
          {
            name: user.firstName + ' ' + user.lastName,
            email: newEmail ?? isEmail ? user.email : user.phone,
            otp,
          },
          isEmail,
        )
      : await this.emailService.verifyEmail(
          {
            name: user.firstName + ' ' + user.lastName,
            email: newEmail ?? isEmail ? user.email : user.phone,
            otp,
          },
          isEmail,
        );

    if (!isOtpSent) {
      throw new BadRequestException('Unable to send verification code');
    }
    await this.usersRepository.save(user);
    return isOtpSent;
  }

  async newPass(user: User, password: string) {
    user = await this.usersService.findOneById(user.id);

    user.password = await bcrypt.hash(password, 10);
    user.otp = null;
    this.usersRepository.save(user);
    return true;
  }
  async newEmail(user: User, newEmail: string) {
    if (!newEmail) {
      throw new BadRequestException('Email required');
    }
    user = await this.usersService.findOneById(user.id);
    if (
      await this.usersRepository.findOneBy({
        email: newEmail,
      })
    ) {
      throw new BadRequestException('Email taken');
    }
    await this.sendOtp(true, null, user, true, newEmail);
  }
}
