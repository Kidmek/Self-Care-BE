import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { Constants } from 'src/config/constants';
import { existsSync, mkdirSync, writeFile, unlink } from 'fs';
import { join } from 'path';
import { Tip, TipType } from './entities/tip.entity';
import { Media } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TipsService {
  constructor(
    @InjectRepository(Tip)
    private tipsRepository: Repository<Tip>,
    @InjectRepository(Media)
    private mediasRepository: Repository<Media>,
  ) {}

  async create(
    files: {
      pictures?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    createTipDto: CreateTipDto,
  ) {
    let tip = new Tip();
    if (createTipDto.id) {
      tip = await this.findOne(createTipDto.id);

      tip.media.forEach((m) => {
        this.removeFile(
          (m.type === 'VIDEO' ? 'videos/' : 'pictures/') + m.fileName,
        );
        this.mediasRepository.delete(m);
      });
    }
    const medias = [];
    const temp = files.pictures ?? [];

    const promise = temp.concat(files.videos ?? [])?.map(async (f) => {
      const { filename } = await this.saveFile(f);
      f.filename = filename;
      const newMedia = new Media();
      newMedia.fileName = filename;
      newMedia.size = f.size;
      newMedia.type = f.fieldname === 'pictures' ? 'PICTURE' : 'VIDEO';
      medias.push(newMedia);
      console.log('Saved ', filename);
    });

    await Promise.all(promise);

    tip.description = createTipDto.description;
    tip.title = createTipDto.title;

    tip.amh_description = createTipDto.amh_description;
    tip.amh_title = createTipDto.amh_title;
    tip.type = createTipDto.type;
    await this.mediasRepository.save(medias);
    tip.media = medias;
    await this.tipsRepository.save(tip);
    return 'Successfully saved';
  }

  findAll() {
    return this.tipsRepository.find();
  }

  async findOne(id: number) {
    const tip = await this.tipsRepository.findOneBy({ id });
    if (tip) {
      return tip;
    }
    throw new BadRequestException('Tip Not Found');
  }

  findByType(type: TipType) {
    return this.tipsRepository.findBy({ type });
  }

  update(id: number, updateTipDto: UpdateTipDto) {
    console.log(updateTipDto);
    return `This action updates a #${id} tip`;
  }

  async remove(id: number) {
    const tip = await this.findOne(id);

    for (const m of tip.media) {
      this.removeFile(
        (m.type === 'VIDEO' ? 'videos/' : 'pictures/') + m.fileName,
      );
      await this.mediasRepository.delete(m.id);
    }

    await this.tipsRepository.delete(id);
    return `Deleted`;
  }

  removeFile(path: string): void {
    if (!path) {
      return;
    }
    const file = join('./' + Constants.uploadDir, path);
    if (existsSync(file)) {
      unlink(file, (err) => {
        if (err) {
          console.log('Error deleting', path);
          console.log(err);
        } else {
          console.log(path, 'Deleted');
        }
      });
    }
  }

  saveFile(file: Express.Multer.File): Promise<{ filename: string }> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject();
      }
      const filename = Date.now() + '-' + file.originalname;

      // Writing file to disk
      try {
        const directory = join('./' + Constants.uploadDir, file.fieldname);
        if (!existsSync(directory)) {
          mkdirSync(directory, { recursive: true });
        }

        const filePath = join(directory, filename);
        writeFile(filePath, file.buffer, (err) => {
          if (err) {
            reject(`Failed to save file: ${err}`);
          } else {
            resolve({ filename });
          }
        });
      } catch (ex) {
        console.log('Saving Exception ', filename, ex);
        reject(ex);
      }

      // resolve({ filename });
    });
  }
}
