import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ToolsIssuedService } from './tools-issued.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ToolsByEmployeeShiftResponseDto } from './dto/tools-by-employee-shift.dto';

@ApiTags('Tools Issued')
@Controller('tools-issued')
export class ToolsIssuedController {
  constructor(private readonly toolsService: ToolsIssuedService) {}

  @Post('issue')
  @ApiOperation({ summary: 'Registrar préstamo de herramienta' })
  async issueTool(
    @Param('shiftId') shiftId: string,
    @Body() body: { productId: number; quantity: number }
  ) {
    return this.toolsService.registerToolsIssue(
      +shiftId,
      body.productId,
      body.quantity
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

  @Post('return')
  @ApiOperation({ summary: 'Registrar devolución de herramienta' })
  async returnTool(
    @Param('shiftId') shiftId: string,
    @Body() body: { productId: number; quantity: number }
  ) {
    return this.toolsService.registerToolsReturn(
      +shiftId,
      body.productId,
      body.quantity
    );
  }
}