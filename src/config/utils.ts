import { diskStorage } from 'multer';
import * as fs from 'fs';
import { Constants } from './constants';

export const getSecondsDiff = (start: Date, end: Date): number => {
  const diff = end.getTime() - start.getTime();
  return Math.round(diff / 1000);
};

export const storage = diskStorage({
  destination: (req, file, cb) => {
    const path = `./${Constants.uploadDir}/${file.fieldname}`; // saves files under 'uploads/pictures' and 'uploads/videos'
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

/**
 * Ensures that a directory exists.
 * If the directory structure does not exist, it is created.
 * @param {string} dirPath - The path to the directory to check and create if necessary.
 * @returns {Promise<void>}
 */
export const ensureDirectoryExists = (dirPath: string) => {
  return new Promise((resolve, reject) => {
    fs.access(dirPath, fs.constants.F_OK, (err) => {
      if (err) {
        // Directory does not exist, so create it
        fs.mkdir(dirPath, { recursive: true }, (err) => {
          if (err) {
            reject(`Failed to create directory: ${err}`);
          } else {
            resolve(`Directory created: ${dirPath}`);
          }
        });
      } else {
        resolve(`Directory already exists: ${dirPath}`);
      }
    });
  });
};
