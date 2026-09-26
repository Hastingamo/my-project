import { Injectable } from '@nestjs/common';
import { CreateAddImageDto } from './dto/create-add-image.dto';
import { UpdateAddImageDto } from './dto/update-add-image.dto';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';
@Injectable()
export class AddImagesService {
  // uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
  //   return new Promise((resolve, reject) => {
  //     const uploadStream = cloudinary.uploader.upload_stream(
  //       { folder: 'your-app-folder' },
  //       (error, result) => {
  //         if (error) return reject(error);
  //         resolve(result);
  //       },
  //     );
  //     streamifier.createReadStream(file.buffer).pipe(uploadStream);
  //   });
  // }
  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'your-app-folder' },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new Error('Cloudinary upload failed: no result returned'),
            );
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  create(createAddImageDto: CreateAddImageDto) {
    return 'This action adds a new addImage';
  }

  findAll() {
    return `This action returns all addImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} addImage`;
  }

  update(id: number, updateAddImageDto: UpdateAddImageDto) {
    return `This action updates a #${id} addImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} addImage`;
  }
}
