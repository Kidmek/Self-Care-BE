import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PageDto } from 'src/common/dto/page.dto';
import { UserDto } from './dto/user.dto';
import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Constants, ErrorMessages, Language } from 'src/config/constants';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(
    pageQueryDto: PageQueryDto,
    admin: User,
    role?: UserRole,
  ): Promise<PageDto<UserDto>> {
    await this.checkPrivilage(admin);
    const queryBuilder = this.usersRepository.createQueryBuilder('users');

    if (pageQueryDto.query) {
      const search = `${pageQueryDto.query}%`;
      queryBuilder.where(
        'users.email LIKE :search OR users.phone LIKE :search OR users.firstName LIKE :search OR users.lastName LIKE :search',
        { search },
      );
    }

    // Add role filter only if it's provided and not null
    if (role) {
      queryBuilder.andWhere('users.role = :role', { role });
    } else {
      queryBuilder.andWhere('users.role <> :role', { role: 'customer' });
    }
    queryBuilder
      .orderBy('users.createdAt', pageQueryDto.order)
      .skip(pageQueryDto.skip)
      .take(pageQueryDto.take);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageQueryDto });

    return new PageDto(
      entities.map((u) => this.toUserDto(u)),
      pageMetaDto,
    );
  }

  async findOneById(id: number): Promise<User> {
    const found = await this.usersRepository.findOneBy({ id });
    if (!found) {
      throw new BadRequestException('User not found');
    }
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByPhone(phone: string) {
    if (phone?.length) {
      phone = phone.slice(-9);
      return await this.usersRepository.findOneBy({ phone });
    } else {
      throw new BadRequestException('Phone not registered');
    }
  }

  async findOneByEmailOrPhone(emailOrPhone: string) {
    return emailOrPhone?.match(Constants.emailRegEx)
      ? await this.findOneByEmail(emailOrPhone)
      : await this.findOneByPhone(emailOrPhone);
  }

  async findOneByEmail(email: string) {
    if (email?.length) {
      return await this.usersRepository.findOneBy({ email });
    } else {
      throw new BadRequestException('Email not registered');
    }
  }

  async updateSelf(
    user: User,
    updateUserDto: UpdateUserDto,
    lang: Language = 'en',
  ) {
    user = await this.findOneById(user.id);

    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    if (updateUserDto.email && user.email !== updateUserDto.email) {
      if (await this.findOneByEmailOrPhone(updateUserDto.email)) {
        throw new BadRequestException(ErrorMessages[lang].emailTaken);
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.phone && user.phone !== updateUserDto.phone.slice(-9)) {
      if (await this.findOneByEmailOrPhone(updateUserDto.phone)) {
        throw new BadRequestException(ErrorMessages[lang].phoneTaken);
      }
      user.phone = updateUserDto.phone;
    }

    if (updateUserDto.birthDate) {
      user.birthDate = updateUserDto.birthDate;
    }
    if (updateUserDto.gender) {
      user.gender = updateUserDto.gender;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.toUserDto(await this.usersRepository.save(user));
  }

  async create(admin: User, createUserDto: CreateUserDto) {
    await this.checkPrivilage(admin);
    let user = new User();

    if (createUserDto.id) {
      user = await this.findOneById(createUserDto.id);
    }
    if (user.phone !== createUserDto.phone.slice(-9)) {
      if (await this.findOneByPhone(createUserDto.phone)) {
        throw new BadRequestException('Phone taken');
      }
    }
    if (user.email !== createUserDto.email) {
      if (await this.findOneByEmail(createUserDto.email)) {
        throw new BadRequestException('Email taken');
      }
    }

    user.phone = createUserDto.phone.slice(-9);
    user.birthDate = createUserDto.birthDate;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.gender = createUserDto.gender;
    user.role = createUserDto.role;
    user.isActive = true;
    user.password = await bcrypt.hash(createUserDto.password, 10);

    return this.toUserDto(await this.usersRepository.save(user));
  }

  async remove(admin: User, id: number) {
    await this.checkPrivilage(admin);
    await this.usersRepository.delete(id);
    return true;
  }

  async changeEnabled(admin: User, id: number, enabled: boolean) {
    await this.checkPrivilage(admin);
    const user = await this.findOneById(id);
    user.isActive = enabled;
    await this.usersRepository.save(user);
    return true;
  }

  toUserDto(user: User): UserDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, otp, otpSentAt, ...rest } = user;

    return rest;
  }

  async checkPrivilage(user: User) {
    user = await this.findOneById(user.id);
    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }
  }
}
