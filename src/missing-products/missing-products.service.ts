import { Injectable } from '@nestjs/common';
import { CreateMissingProductDto } from './dto/create-missing-product.dto';
import { UpdateMissingProductDto } from './dto/update-missing-product.dto';

@Injectable()
export class MissingProductsService {
  create(createMissingProductDto: CreateMissingProductDto) {
    return 'This action adds a new missingProduct';
  }

  findAll() {
    return `This action returns all missingProducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} missingProduct`;
  }

  update(id: number, updateMissingProductDto: UpdateMissingProductDto) {
    return `This action updates a #${id} missingProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} missingProduct`;
  }
}
