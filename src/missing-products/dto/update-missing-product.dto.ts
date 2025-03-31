import { PartialType } from '@nestjs/swagger';
import { CreateMissingProductDto } from './create-missing-product.dto';

export class UpdateMissingProductDto extends PartialType(CreateMissingProductDto) {}
