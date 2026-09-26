import { Module } from '@nestjs/common';
import { AddImagesService } from './add-images.service';
import { AddImagesController } from './add-images.controller';
import { CloudinaryProvider } from 'src/file-upload/cloudianary';

@Module({
  controllers: [AddImagesController],
  providers: [AddImagesService, CloudinaryProvider],
})
export class AddImagesModule {}
