import { Test, TestingModule } from '@nestjs/testing';
import { AddImagesService } from './add-images.service';

describe('AddImagesService', () => {
  let service: AddImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddImagesService],
    }).compile();

    service = module.get<AddImagesService>(AddImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
