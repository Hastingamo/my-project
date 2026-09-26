import { Test, TestingModule } from '@nestjs/testing';
import { AddImagesController } from './add-images.controller';
import { AddImagesService } from './add-images.service';

describe('AddImagesController', () => {
  let controller: AddImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddImagesController],
      providers: [AddImagesService],
    }).compile();

    controller = module.get<AddImagesController>(AddImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
