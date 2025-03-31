import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: Product })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos con paginación' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Cantidad de productos por página' })
  @ApiResponse({ status: 200, description: 'Lista de productos', type: [Product] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar productos por nombre' })
  @ApiQuery({ name: 'name', example: 'Laptop', description: 'Nombre o parte del nombre del producto' })
  searchByName(@Query('name') name: string) {
    return this.productsService.searchByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del producto a buscar' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id/increase')
  @ApiOperation({ summary: 'Aumentar stock de un producto' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del producto' })
  @ApiQuery({ name: 'quantity', example: 5, description: 'Cantidad a aumentar' })
  increaseStock(@Param('id') id: number, @Query('quantity') quantity: number) {
    return this.productsService.increaseStock(id, +quantity);
  }

  @Patch(':id/decrease')
  @ApiOperation({ summary: 'Disminuir stock de un producto' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del producto' })
  @ApiQuery({ name: 'quantity', example: 3, description: 'Cantidad a disminuir' })
  decreaseStock(@Param('id') id: number, @Query('quantity') quantity: number) {
    return this.productsService.decreaseStock(id, +quantity);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto por ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del producto a actualizar' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del producto a eliminar' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}
