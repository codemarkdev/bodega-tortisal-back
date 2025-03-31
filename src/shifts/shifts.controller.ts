import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@ApiTags('Shifts')
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar entrada del empleado' })
  @ApiResponse({ status: 201, description: 'Turno registrado correctamente' })
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftsService.create(createShiftDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los turnos' })
  findAll() {
    return this.shiftsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un turno por ID' })
  findOne(@Param('id') id: number) {
    return this.shiftsService.findOne(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Obtener los turnos de un empleado por fecha' })
  getShifts(
    @Param('employeeId') employeeId: number,
    @Query('date') date?: string,
  ) {
    return this.shiftsService.getShiftsForEmployee(employeeId, date);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Registrar salida del turno' })
  update(@Body() updateShiftDto: UpdateShiftDto) {
    return this.shiftsService.updateShiftByEmployee(updateShiftDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un turno' })
  remove(@Param('id') id: number) {
    return this.shiftsService.remove(id);
  }
}
