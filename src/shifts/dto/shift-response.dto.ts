import { ApiProperty } from '@nestjs/swagger';

export class ShiftResponseDto {
  @ApiProperty({ description: 'ID del turno', example: 1 })
  id: number;

  @ApiProperty({ 
    description: 'Fecha y hora de entrada', 
    example: '15-05-2023 08:00:00' 
  })
  check_in_time: string;

  @ApiProperty({ 
    description: 'Fecha y hora de salida', 
    example: '15-05-2023 16:30:00',
    nullable: true 
  })
  check_out_time: string | null;

  @ApiProperty({ 
    description: 'ID del empleado',
    example: 1 
  })
  employeeId: number;

  @ApiProperty({ 
    description: 'Nombre completo del empleado',
    example: 'Juan Pérez' 
  })
  employeeName: string;

  @ApiProperty({ 
    description: 'DUI del empleado',
    example: '12345678-9' 
  })
  employeeDui: string;

  @ApiProperty({ 
    description: 'Estado del turno',
    enum: ['ACTIVO', 'CERRADO'],
    example: 'ACTIVO' 
  })
  status: string;
}