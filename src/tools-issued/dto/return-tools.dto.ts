import { IsInt, IsPositive, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnToolDto {
  @ApiProperty({
    description: 'ID del producto que se va a devolver',
    example: 1,
    type: Number
  })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'Cantidad de producto devuelto',
    example: 2,
    type: Number
  })
  @IsInt()
  @IsPositive()
  quantityReturned: number;
}

export class RegisterMultipleToolsReturnDto {
  @ApiProperty({
    description: 'Lista de herramientas devueltas',
    type: [ReturnToolDto],
    example: [
      { productId: 1, quantityReturned: 2 },
      { productId: 2, quantityReturned: 3 }
    ]
  })
  @IsArray()
  @ArrayNotEmpty()
  tools: ReturnToolDto[];
}
