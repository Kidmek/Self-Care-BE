import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
  HttpCode,
  Body,
  Put,
  Post,
  ParseBoolPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { UserDto } from './dto/user.dto';
import { User, UserRole } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UserDecorator } from 'src/common/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LanguageGuard } from 'src/common/language.guard';
import { LanguageDec } from 'src/common/language.decorator';
import { Language } from 'src/config/constants';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() pageQueryDto: PageQueryDto,
    @UserDecorator() user: User,
    @Query('role') role?: UserRole,
  ): Promise<PageDto<UserDto>> {
    return this.usersService.findAll(pageQueryDto, user, role);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, LanguageGuard)
  @Put()
  update(
    @UserDecorator() user: User,
    @Body() updateUserDto: UpdateUserDto,
    @LanguageDec() lang: Language,
  ) {
    return this.usersService.updateSelf(user, updateUserDto, lang);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post()
  create(@UserDecorator() user: User, @Body() creatUserDto: CreateUserDto) {
    return this.usersService.create(user, creatUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@UserDecorator() user: User, @Param('id') id: string) {
    return this.usersService.remove(user, +id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  changeEnabled(
    @UserDecorator() user: User,
    @Param('id') id: string,
    @Query('enabled', ParseBoolPipe) enabled: boolean,
  ) {
    return this.usersService.changeEnabled(user, +id, enabled);
  }
}
