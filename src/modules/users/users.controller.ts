import {
  Controller,
  Get,
  // Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { UserDto } from './dto/user.dto';
import { UserRole } from './entities/user.entity';

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

  @Get('username/:uname')
  findOneByUsername(@Param('uname') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
