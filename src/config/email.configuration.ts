import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  username: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
}));
