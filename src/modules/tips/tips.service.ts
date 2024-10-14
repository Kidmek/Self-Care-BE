import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTipDto } from './dto/create-tip.dto';
import { Constants } from 'src/config/constants';
import { existsSync, mkdirSync, writeFile, unlink } from 'fs';
import { join } from 'path';
import { Tip, TipType } from './entities/tip.entity';
import { Media } from './entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TipsService {
  constructor(
    @InjectRepository(Tip)
    private tipsRepository: Repository<Tip>,
    @InjectRepository(Media)
    private mediasRepository: Repository<Media>,
    private usersService: UsersService,
  ) {}

  async create(
    files: {
      pictures?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    createTipDto: CreateTipDto,
    user: User,
  ) {
    this.usersService.checkPrivilage(user);
    let tip = new Tip();
    let medias = [];
    if (createTipDto.id) {
      tip = await this.findOne(createTipDto.id);
      const removedVideos = createTipDto.removedVideos?.split(',') ?? [];
      const removedPictures = createTipDto.removedPictures?.split(',') ?? [];
      this.getMedias([...removedVideos, ...removedPictures], tip.media).forEach(
        (m) => {
          this.removeFile(
            (m.type === 'VIDEO' ? 'videos/' : 'pictures/') + m.fileName,
          );
          this.mediasRepository.delete(m);
        },
      );
      medias = tip.media.filter(
        (m) =>
          ![...removedVideos, ...removedPictures].includes(m.id.toString()),
      );
    }
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

    tip.amh_description = createTipDto.amh_description;
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

  getMedias(ids: string[], medias: Media[]): Media[] {
    // Create a Map for quick lookup of media by id
    const mediaMap = new Map<string, Media>();

    // Populate the Map with media items
    medias.forEach((media) => {
      mediaMap.set(media.id.toString(), media);
    });

    // Retrieve media objects for the given ids
    return ids
      .map((id) => mediaMap.get(id))
      .filter((media) => media !== undefined) as Media[];
  }

  async remove(id: number, user: User) {
    this.usersService.checkPrivilage(user);
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
