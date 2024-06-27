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

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query() pageQueryDto: PageQueryDto,
    @Query('role') role?: UserRole,
  ): Promise<PageDto<UserDto>> {
    return this.usersService.findAll(pageQueryDto, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(+id);
  }

  @Get('email/:email')
  findOneByEmail(@Param('uname') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put()
  update(@UserDecorator() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
