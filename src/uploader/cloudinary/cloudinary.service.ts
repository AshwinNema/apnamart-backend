import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {CloudinaryResponse} from "../../utils/types"
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(public_id:string) {
    return cloudinary.uploader.destroy(public_id)
  }
}
