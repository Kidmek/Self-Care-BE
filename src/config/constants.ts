export const Constants = {
  name: 'እኔ ለእኔ',
  description: 'እኔ ለእኔ',
  version: '1.0',
  email: 'testingotp099@gmail.com',
  website: 'www.እኔለእኔ.com',
  country: 'Ethiopia',
  city: 'Addis Ababa',
  otpExpire: 1, //hour
  otpResend: 1, //minute
  uploadDir: 'uploads',
  phoneRegEx: /^(?:\+251|0)\d{9}$/,
  emailRegEx: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  phone: '910101010',
  password: 'password',
};
export type Language = 'am' | 'en';
type ErrorMessagesType = {
  wrongPassword: string;
  emailTaken: string;
  phoneTaken: string;
  userNotFound: string;
  unableToSendCode: string;
  incorrectCode: string;
  otpExpired: string;
  otpResendTimeNotReached: string;
  emailRequired: string;
  emailOrPhoneRequired: string;
};

export const ErrorMessages: {
  am: ErrorMessagesType;
  en: ErrorMessagesType;
} = {
  en: {
    wrongPassword: 'Incorrect password. Please try again.',
    emailTaken: 'This email is already registered.',
    phoneTaken: 'This phone number is already registered.',
    userNotFound: 'User not found. Please check your details.',
    unableToSendCode: 'Unable to send verification code. Please try again.',
    incorrectCode: 'The code you entered is incorrect.',
    otpExpired: 'The OTP has expired. Please request a new one.',
    otpResendTimeNotReached: 'You can resend the OTP after some time.',
    emailRequired: 'Email address is required.',
    emailOrPhoneRequired: 'Email or phone number is required.',
  },
  am: {
    wrongPassword: 'የተሳሳተ የይለፍ ቃል። እባክዎ ዳግም ይሞክሩ።',
    emailTaken: 'ይህ ኢሜል አስቀድሞ ተመዝግቧል።',
    phoneTaken: 'ይህ ስልክ ቁጥር አስቀድሞ ተመዝግቧል።',
    userNotFound: 'ተጠቃሚ አልተገኘም። እባክዎ ዝርዝሮችዎን ያረጋግጡ።',
    unableToSendCode: 'የማረጋገጫ ኮድ ማላክ አልተቻለም። እባክዎ ዳግም ይሞክሩ።',
    incorrectCode: 'ያስገቡት ኮድ የተሳሳተ ነው።',
    otpExpired: 'ኮድ አልቋል። እባክዎ አዲስ ኮድ ይጠይቁ።',
    otpResendTimeNotReached: 'ኮድ የማስተላለፍ ጊዜ አልደረሰም። እባክዎ ጥቂት ጊዜ ተጠብቁ።',
    emailRequired: 'ኢሜል አስፈላጊ ነው።',
    emailOrPhoneRequired: 'ኢሜል ወይም ስልክ ቁጥር አስፈላጊ ነው።',
  },
};
