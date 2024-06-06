import { Injectable } from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PageDto } from 'src/common/dto/page.dto';
import { UserDto } from './dto/user.dto';
import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(
    pageQueryDto: PageQueryDto,
    role?: UserRole,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('users');

    if (pageQueryDto.query) {
      const search = `%${pageQueryDto.query}%`;
      queryBuilder.where(
        'users.email LIKE :search OR users.username LIKE :search OR users.firstName LIKE :search OR users.lastName LIKE :search',
        { search },
      );
    }

    // Add role filter only if it's provided and not null
    if (role) {
      queryBuilder.andWhere('users.role = :role', { role });
    }
    queryBuilder
      .orderBy('users.createdAt', pageQueryDto.order)
      .skip(pageQueryDto.skip)
      .take(pageQueryDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageQueryDto });

    return new PageDto(
      entities.map((u) => this.toUserDto(u)),
      pageMetaDto,
    );
  }

  findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  private toUserDto(user: User): UserDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, otp, otpSentAt, ...rest } = user;

    return rest;
  }
}
