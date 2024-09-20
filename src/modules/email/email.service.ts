import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Constants } from 'src/config/constants';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async forgotPasswordEmail(
    data: {
      name: any;
      email: any;
      otp: any;
    },
    isEmail: boolean,
  ) {
    const { name, email, otp } = data;

    const subject = `${Constants.name} password reset`;
    if (!isEmail) {
      return await this.sendText(email, otp);
    }
    try {
      const response = await this.mailerService.sendMail({
        to: email,
        subject,
        template: './forgot-password',
        context: {
          otp,
          name,
          companyCity: Constants.city,
          companyCountry: Constants.country,
          companyWebsite: Constants.website,
          companyName: Constants.name,
          companyEmail: Constants.email,
        },
      });
      if (response != null) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('Error sending email');
      console.log(e);
      return false;
    }
  }

  async verifyEmail(
    data: {
      name: any;
      email: any;
      otp: any;
    },
    isEmail: boolean,
  ): Promise<boolean> {
    const { name, email, otp } = data;

    const subject = `${Constants.name} Verify Email`;
    if (!isEmail) {
      return await this.sendText(email, otp);
    }
    try {
      const response = await this.mailerService.sendMail({
        to: email,
        subject,
        template: './verify-email',
        context: {
          otp,
          name,
          companyCity: Constants.city,
          companyCountry: Constants.country,
          companyWebsite: Constants.website,
          companyName: Constants.name,
          companyEmail: Constants.email,
        },
      });
      if (response != null) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('Error sending email');
      console.log(e);
      return false;
    }
  }

  async sendText(phone: string, message: string) {
    console.log('Sending', message, 'Text to ', phone);
    return true;
  }
}
