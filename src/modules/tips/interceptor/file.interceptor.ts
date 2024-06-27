// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   BadRequestException,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';

// @Injectable()
// export class FileValidationInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const files = request.files;

//     let isPicture = true;
//     let isVideo = true;

//     // Assuming you have predefined size limits and file types
//     const MAX_SIZE = 5 * 1024 * 1024; // 5MB for example
//     const allowedPictureTypes = 'image/';
//     const allowedVideoTypes = 'video/';

//     // Iterate through all file fields
//     Object.keys(files).forEach((field) => {
//       files[field].forEach((file: Express.Multer.File) => {
//         // Check file size
//         if (file.size > MAX_SIZE) {
//           throw new BadRequestException(
//             `File size limit exceeded for ${file.originalname}`,
//           );
//         }
//         console.log(file.mimetype);

//         // Check file types
//         if (
//           files.fieldname === 'pictures' &&
//           !file.mimetype.startsWith(allowedPictureTypes)
//         ) {
//           isPicture = false;
//         }
//         if (
//           files.fieldname === 'videos' &&
//           !file.mimetype.startsWith(allowedVideoTypes)
//         ) {
//           isVideo = false;
//         }
//       });
//     });

//     // Check if all files are pictures or videos, but not mixed
//     if (!isPicture || !isVideo) {
//       throw new BadRequestException('Invalid file format');
//     }

//     return next.handle();
//   }
// }
