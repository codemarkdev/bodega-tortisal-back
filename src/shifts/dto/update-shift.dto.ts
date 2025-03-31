import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateShiftDto {

  @ApiProperty({ example: 1, description: 'ID del empleado' })
  @IsNotEmpty({ message: 'El id del empleado es obligatorio' })
  @IsNumber({}, { message: 'El id del empleado debe ser un número' })
  employeeId: number;
}
