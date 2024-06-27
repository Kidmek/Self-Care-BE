import { Gender, UserRole } from '../entities/user.entity';

export class UserDto {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  birthDate: Date;

  gender: Gender;

  isActive: boolean;

  role: UserRole;

  createdAt: Date;
}
