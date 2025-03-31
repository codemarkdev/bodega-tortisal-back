import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MissingProductsService } from './missing-products.service';
import { CreateMissingProductDto } from './dto/create-missing-product.dto';
import { UpdateMissingProductDto } from './dto/update-missing-product.dto';

@Controller('missing-products')
export class MissingProductsController {
  constructor(private readonly missingProductsService: MissingProductsService) {}

  @Post()
  create(@Body() createMissingProductDto: CreateMissingProductDto) {
    return this.missingProductsService.create(createMissingProductDto);
  }

  @Get()
  findAll() {
    return this.missingProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missingProductsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMissingProductDto: UpdateMissingProductDto) {
    return this.missingProductsService.update(+id, updateMissingProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missingProductsService.remove(+id);
  }
}
