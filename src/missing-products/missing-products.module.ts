import { Module } from '@nestjs/common';
import { MissingProductsService } from './missing-products.service';
import { MissingProductsController } from './missing-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissingProduct } from './entities/missing-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MissingProduct])],
  controllers: [MissingProductsController],
  providers: [MissingProductsService],
})
export class MissingProductsModule {}
