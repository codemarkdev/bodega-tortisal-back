import { ApiProperty } from '@nestjs/swagger';

// Interface auxiliar para TypeScript (no se expone en Swagger)
interface ProductInfo {
  id: number;
  name: string;
  description: string;
  isConsumable: boolean;
}

// DTO para cada herramienta individual
export class ToolItemDto {
  @ApiProperty({ 
    description: 'ID del registro de préstamo', 
    example: 1 
  })
  id: number;

  @ApiProperty({ 
    description: 'Información del producto prestado',
    type: 'object',
    properties: {
      id: { type: 'number', example: 3 },
      name: { type: 'string', example: 'Taladro' },
      description: { type: 'string', example: 'Taladro inalámbrico 18V' },
      isConsumable: { type: 'boolean', example: false }
    }
  })
  product: ProductInfo;

  @ApiProperty({ 
    description: 'Cantidad prestada', 
    example: 2 
  })
  issued: number;

  @ApiProperty({ 
    description: 'Cantidad devuelta', 
    example: 1,
    nullable: true 
  })
  returned: number | null;

  @ApiProperty({ 
    description: 'Cantidad reportada como faltante', 
    example: 0 
  })
  missing: number;

  @ApiProperty({ 
    description: 'Estado actual del préstamo',
    enum: ['PENDIENTE', 'COMPLETO', 'PARCIAL', 'CON_FALTANTES'],
    example: 'PARCIAL'
  })
  status: string;
}

// DTO para el resumen estadístico
export class ToolsSummaryDto {
  @ApiProperty({ 
    description: 'Cantidad total de herramientas diferentes prestadas', 
    example: 3 
  })
  totalTools: number;

  @ApiProperty({ 
    description: 'Suma total de unidades prestadas de todas las herramientas', 
    example: 5 
  })
  totalIssued: number;

  @ApiProperty({ 
    description: 'Suma total de unidades devueltas', 
    example: 3 
  })
  totalReturned: number;

  @ApiProperty({ 
    description: 'Suma total de unidades reportadas como faltantes', 
    example: 1 
  })
  totalMissing: number;

  @ApiProperty({ 
    description: 'Unidades pendientes por devolver (no devueltas ni faltantes)', 
    example: 1 
  })
  pending: number;
}

// DTO principal que engloba toda la respuesta
export class ToolsByEmployeeShiftResponseDto {
  @ApiProperty({ 
    description: 'ID del empleado', 
    example: 5 
  })
  employeeId: number;

  @ApiProperty({ 
    description: 'Nombre completo del empleado', 
    example: 'Juan Pérez' 
  })
  employeeName: string;

  @ApiProperty({ 
    description: 'ID del turno laboral', 
    example: 123 
  })
  shiftId: number;

  @ApiProperty({ 
    description: 'Fecha y hora de inicio del turno', 
    example: '2023-05-20 08:00:00' 
  })
  shiftStart: string;

  @ApiProperty({ 
    description: 'Fecha y hora de fin del turno (null si aún está activo)', 
    example: '2023-05-20 16:30:00',
    nullable: true 
  })
  shiftEnd: string | null;

  @ApiProperty({ 
    description: 'Listado detallado de herramientas prestadas',
    type: [ToolItemDto] 
  })
  tools: ToolItemDto[];

  @ApiProperty({ 
    description: 'Resumen estadístico del préstamo',
    type: ToolsSummaryDto 
  })
  summary: ToolsSummaryDto;
}