import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({ example: 1, description: 'ID del empleado' })
  @IsNotEmpty({ message: 'El id del empleado es obligatorio' })
  @IsNumber({}, { message: 'El id del empleado debe ser un número' })
  id_employee: number;
}
