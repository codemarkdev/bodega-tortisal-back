import { Module } from '@nestjs/common';
import { ToolsIssuedService } from './tools-issued.service';
import { ToolsIssuedController } from './tools-issued.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolsIssued } from './entities/tools-issued.entity';
import { Product } from 'src/products/entities/product.entity';
import { Shift } from 'src/shifts/entities/shift.entity';
import { MissingProduct } from 'src/missing-products/entities/missing-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ToolsIssued, Product, Shift, MissingProduct])],
  controllers: [ToolsIssuedController],
  providers: [ToolsIssuedService],
})
export class ToolsIssuedModule {}
