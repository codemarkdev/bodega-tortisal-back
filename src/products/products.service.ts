import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {

    const product = await this.productRepository.create(createProductDto);

    return this.productRepository.save(product);
  }

  async findAll(paginationDto: PaginationDto) {
    
    const { page = 1, limit = 10 } = paginationDto;
    const [ data, total ] = await this.productRepository.findAndCount({
      take: Number(limit),
      skip: Number(( page - 1 )) * Number( limit ),
    })
   
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async findOne(id: number) {
    
    const product = await this.productRepository.findOne({
      where: { id: id }
    })

    if (!product) { throw new HttpException(`El producto con el ID: ${id} no existe!`, HttpStatus.NOT_FOUND)}

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    
    const product = await this.findOne(id);

    return this.productRepository.remove(product);
  
  }

  async increaseStock(id: number, quantity: number) {
    const product = await this.findOne(id);
    product.quantity += quantity;
    return this.productRepository.save(product);
  }
  
  async decreaseStock(id: number, quantity: number) {
    const product = await this.findOne(id);
    if (product.quantity < quantity) {
      throw new HttpException('Stock insuficiente', HttpStatus.BAD_REQUEST);
    }
    product.quantity -= quantity;
    return this.productRepository.save(product);
  }

  async searchByName(name: string) {
    return this.productRepository.find({
      where: { name: ILike(`%${name}%`)  },
      select: ['id', 'name', 'quantity']
    });
  }
}
