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
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileValidationPipe } from './interceptor/file.pipe';
import { memoryStorage } from 'multer';
import { TipType } from './entities/tip.entity';

@Controller('tips')
@ApiTags('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post()
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
  ) {
    return this.tipsService.create(files, createTipDto);
  }

  @Get()
  findAll() {
    return this.tipsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipsService.findOne(+id);
  }

  @Get('/type/:type')
  findByType(@Param('type') type: TipType) {
    return this.tipsService.findByType(type);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipDto: UpdateTipDto) {
    return this.tipsService.update(+id, updateTipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipsService.remove(+id);
  }
}
