import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ReturnMissingProductDto {
  @ApiProperty({ example: 3, description: 'ID del empleado que devuelve el producto' })
  @IsInt({ message: 'El employeeId debe ser un número entero' })
  employeeId: number;

  @ApiProperty({ example: 2, description: 'ID del producto a devolver' })
  @IsInt({ message: 'El productId debe ser un número entero' })
  productId: number;

  @ApiProperty({ example: 1, description: 'Cantidad del producto que se devuelve' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima a devolver es 1' })
  quantityReturned: number;
}
