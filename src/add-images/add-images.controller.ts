import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddImagesService } from './add-images.service';
// import { CreateAddImageDto } from './dto/create-add-image.dto';
import { UpdateAddImageDto } from './dto/update-add-image.dto';

@Controller('add-images')
export class AddImagesController {
  constructor(private readonly addImagesService: AddImagesService) {}

  // @Post()
  // create(@Body() createAddImageDto: CreateAddImageDto) {
  //   return this.addImagesService.create(createAddImageDto);
  // }
    @Post('image')
  @UseInterceptors(FileInterceptor('file')) // 'file' = form field name
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const result = await this.addImagesService.uploadImage(file);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  @Get()
  findAll() {
    return this.addImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddImageDto: UpdateAddImageDto) {
    return this.addImagesService.update(+id, updateAddImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addImagesService.remove(+id);
  }
}
