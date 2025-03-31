import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ToolsIssuedService } from './tools-issued.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ToolsByEmployeeShiftResponseDto } from './dto/tools-by-employee-shift.dto';
import { CreateToolsIssuedDto } from './dto/issued-tool.dto';
import { RegisterMultipleToolsReturnDto, ReturnToolDto } from './dto/return-tools.dto';

@ApiTags('Tools Issued')
@Controller('tools-issued')
export class ToolsIssuedController {
  constructor(private readonly toolsService: ToolsIssuedService) {}

  @Post('issue/:shiftId')
  @ApiOperation({ summary: 'Registrar préstamo de herramienta' })
  async issueTool(
    @Param('shiftId') shiftId: number,
    @Body() body: CreateToolsIssuedDto
  ) {
    return this.toolsService.registerMultipleToolsIssue(
      shiftId,
      body.products
    );
  }

  @Get('employee/:employeeId/shift/:shiftId')
  @ApiOperation({
    summary: 'Obtener herramientas por empleado y turno',
    description: 'Devuelve el detalle completo de herramientas asociadas a un empleado en un turno específico'
  })
  @ApiParam({ name: 'employeeId', description: 'ID del empleado', type: Number })
  @ApiParam({ name: 'shiftId', description: 'ID del turno', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Detalle de herramientas prestadas',
    type: ToolsByEmployeeShiftResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Turno no encontrado o no pertenece al empleado'
  })
  async getToolsByEmployeeAndShift(
    @Param('employeeId') employeeId: string,
    @Param('shiftId') shiftId: string
  ): Promise<ToolsByEmployeeShiftResponseDto> {
    return this.toolsService.getToolsByEmployeeAndShift(
      parseInt(employeeId),
      parseInt(shiftId)
    );
  }

  @Post('return/:shiftId')
  @ApiOperation({ summary: 'Registrar devolución de herramientas' })
  async returnTools(
    @Param('shiftId') shiftId: string,
    @Body() body: RegisterMultipleToolsReturnDto // Cambiar a un array de objetos
  ) {
    return this.toolsService.registerMultipleToolsReturn(
      +shiftId,  // Convertir shiftId a número
      body.tools      // Pasar el array de productos devueltos
    );
  }
}