import { PartialType } from '@nestjs/mapped-types';
import { CreateAddImageDto } from './create-add-image.dto';

export class UpdateAddImageDto extends PartialType(CreateAddImageDto) {}
