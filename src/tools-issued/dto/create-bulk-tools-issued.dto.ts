import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ToolIssuedItemDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_product: number;

  @ApiProperty({ description: 'Cantidad prestada', example: 2 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}

export class CreateBulkToolsIssuedDto {
  @ApiProperty({ description: 'ID del turno', example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_shift: number;

  @ApiProperty({ type: [ToolIssuedItemDto], description: 'Lista de productos' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToolIssuedItemDto)
  products: ToolIssuedItemDto[];
}