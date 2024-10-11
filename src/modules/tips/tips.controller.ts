import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileValidationPipe } from './interceptor/file.pipe';
import { memoryStorage } from 'multer';
import { TipType } from './entities/tip.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UserDecorator } from 'src/common/user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('tips')
@ApiTags('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pictures', maxCount: 4 },
        { name: 'videos', maxCount: 4 },
      ],
      { storage: memoryStorage() },
    ),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pictures: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Upload up to 4 pictures',
        },
        videos: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Upload up to 4 videos',
        },
        title: {
          type: 'string',
          description: 'Title must not be longer than 40 characters.',
          maxLength: 40,
        },
        description: {
          type: 'string',
          description: 'Description of the tip',
        },
        amh_title: {
          type: 'string',
          description: 'Amharic Title must not be longer than 40 characters.',
          maxLength: 40,
        },
        amh_description: {
          type: 'string',
          description: 'Amharic Description of the tip',
        },
        type: {
          enum: Object.keys(TipType),
          description: 'Type of tip',
        },
        id: {
          type: 'number',
          nullable: true,
        },
      },
    },
  })
  uploadFile(
    @Body()
    createTipDto: CreateTipDto,

    @UploadedFiles(new FileValidationPipe())
    files: {
      pictures?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },

    @UserDecorator() user: User,
  ) {
    return this.tipsService.create(files, createTipDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.tipsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.tipsService.findOne(+id);
  }

  @Get('/type/:type')
  @UseGuards(AuthGuard)
  findByType(@Param('type') type: TipType) {
    return this.tipsService.findByType(type);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateTipDto: UpdateTipDto,
    @UserDecorator() user: User,
  ) {
    return this.tipsService.update(+id, updateTipDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @UserDecorator() user: User) {
    return this.tipsService.remove(+id, user);
  }
}
