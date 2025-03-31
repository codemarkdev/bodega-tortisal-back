import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ToolReturnedItemDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_product: number;

  @ApiProperty({ description: 'Cantidad devuelta', example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity_returned: number;
}

export class ReturnBulkToolsDto {
  @ApiProperty({ type: [ToolReturnedItemDto], description: 'Lista de devoluciones' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToolReturnedItemDto)
  returns: ToolReturnedItemDto[];
}