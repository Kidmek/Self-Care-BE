import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseBoolPipe implements PipeTransform<string, boolean> {
  transform(value: string, metadata: ArgumentMetadata): boolean {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    } else {
      throw new BadRequestException(
        `Validation failed for the field "${metadata.data}". Expected a boolean value.`,
      );
    }
  }
}
