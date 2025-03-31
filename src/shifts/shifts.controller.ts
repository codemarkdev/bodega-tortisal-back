import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { ShiftResponseDto } from './dto/shift-response.dto';

@ApiTags('Shifts')
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo turno (máximo 1 por día por empleado)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Turno creado exitosamente',
    type: Shift 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'El empleado ya tiene un turno hoy' 
  })
  async create(@Body() createDto: CreateShiftDto): Promise<Shift> {
    return this.shiftsService.create(createDto);
  }

  @Get('employee/:employeeId/today')
  @ApiOperation({ summary: 'Obtener turno de hoy para un empleado' })
  @ApiParam({ name: 'employeeId', description: 'ID del empleado', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Turno encontrado o null si no existe',
    type: Shift 
  })
  async getTodayShift(@Param('employeeId') employeeId: string): Promise<Shift | null> {
    return this.shiftsService.getTodayShift(+employeeId);
  }

  @Post('employee/:employeeId/close')
  @ApiOperation({ summary: 'Cerrar turno activo' })
  @ApiParam({ name: 'employeeId', description: 'ID del empleado', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Turno cerrado exitosamente',
    type: Shift 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No se encontró turno para cerrar' 
  })
  async closeShift(@Param('employeeId') employeeId: string): Promise<Shift> {
    return this.shiftsService.closeShift(+employeeId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los turnos' })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Fecha en formato DD-MM-YYYY para filtrar turnos',
    example: '15-05-2023'
  })
  findAll(@Query('date') date?: string) {
    return this.shiftsService.findAll(date);
  }

  @Get('employee/:employeeId/history')
  @ApiOperation({ 
    summary: 'Obtener historial de turnos de un empleado',
    description: 'Retorna todos los turnos de un empleado, opcionalmente filtrados por rango de fechas'
  })
  @ApiParam({
    name: 'employeeId',
    description: 'ID del empleado',
    type: Number
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Fecha de inicio (DD-MM-YYYY)',
    example: '01-01-2025'
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Fecha de fin (DD-MM-YYYY)',
    example: '31-12-2025'
  })
  @ApiResponse({ status: 200, description: 'Historial de turnos encontrado' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  async getEmployeeShiftsHistory(
    @Param('employeeId') employeeId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.shiftsService.getEmployeeShiftsHistory(employeeId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un turno por ID' })
  findOne(@Param('id') id: number) {
    return this.shiftsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un turno' })
  remove(@Param('id') id: number) {
    return this.shiftsService.remove(id);
  }
}
