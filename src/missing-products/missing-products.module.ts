import { Module } from '@nestjs/common';
import { MissingProductsService } from './missing-products.service';
import { MissingProductsController } from './missing-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissingProduct } from './entities/missing-product.entity';
import { Shift } from 'src/shifts/entities/shift.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MissingProduct, Shift, Product])],
  controllers: [MissingProductsController],
  providers: [MissingProductsService],
})
export class MissingProductsModule {}
