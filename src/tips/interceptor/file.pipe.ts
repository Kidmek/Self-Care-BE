import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, _metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata

    let isPicture = true;
    let isVideo = true;
    // Assuming you have predefined size limits and file types
    const MAX_SIZE = 15 * 1024 * 1024; // 5MB for example
    const allowedPictureTypes = 'image/';
    const allowedVideoTypes = 'video/';
    if (value) {
      Object.keys(value).forEach((field) => {
        value[field]?.forEach((file: Express.Multer.File) => {
          // Check file size
          if (file.size > MAX_SIZE) {
            throw new BadRequestException(
              `File size limit exceeded for ${file.originalname}`,
            );
          }

          console.log(file.mimetype);

          // Check file types
          if (
            file.fieldname === 'pictures' &&
            !file.mimetype.startsWith(allowedPictureTypes)
          ) {
            isPicture = false;
          }
          if (
            file.fieldname === 'videos' &&
            !file.mimetype.startsWith(allowedVideoTypes)
          ) {
            isVideo = false;
          }
        });
      });
      if (!isPicture || !isVideo) {
        throw new BadRequestException('Invalid file format');
      }
    }

    return value;
  }
}
