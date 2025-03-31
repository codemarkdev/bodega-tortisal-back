// missing-products.controller.ts
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MissingProductsService } from './missing-products.service';
import { MissingProduct } from './entities/missing-product.entity';
import { ReturnMissingProductDto } from './dto/return-missing-product.dto';

@ApiTags('Missing Products')
@Controller('missing-products')
export class MissingProductsController {
  constructor(private readonly missingProductsService: MissingProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos perdidos' })
  @ApiResponse({ status: 200, description: 'Lista de productos perdidos' })
  findAll() {
    return this.missingProductsService.findAll();
  }

  @Get('employee/:employeeId')
  async findByEmployee(@Param('employeeId') employeeId: number): Promise<MissingProduct[]> {
    return await this.missingProductsService.findByEmployee(employeeId);
  }

  @Get('employee/:employeeId/date-range')
  async findByEmployeeAndDateRange(
    @Param('employeeId') employeeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<MissingProduct[]> {
    return await this.missingProductsService.findByEmployeeAndDateRange(employeeId, startDate, endDate);
  }

  @Get('by-shift/:shiftId')
  @ApiOperation({ summary: 'Obtener productos perdidos por turno' })
  @ApiResponse({ status: 200, description: 'Productos perdidos en el turno especificado' })
  findByShift(@Param('shiftId') shiftId: number) {
    return this.missingProductsService.findByShift(shiftId);
  }

  @Get('most-missing')
  @ApiOperation({ summary: 'Obtener el producto más perdido' })
  @ApiResponse({ status: 200, description: 'Producto con mayor cantidad de pérdidas' })
  getMostMissingProduct() {
    return this.missingProductsService.getMostMissingProduct();
  }

  @Get('worst-employee')
  @ApiOperation({ summary: 'Empleado con más productos perdidos' })
  @ApiResponse({ status: 200, description: 'Empleado con mayor cantidad de productos perdidos' })
  getEmployeeWithMostMissingProducts() {
    return this.missingProductsService.getEmployeeWithMostMissingProducts();
  }

  @Get('total-loss')
  @ApiOperation({ summary: 'Pérdida económica total' })
  @ApiResponse({ status: 200, description: 'Valor total en dinero de productos perdidos' })
  getTotalFinancialLoss() {
    return this.missingProductsService.getTotalFinancialLoss();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas completas de productos perdidos' })
  @ApiResponse({ status: 200, description: 'Estadísticas consolidadas' })
  getStats() {
    return this.missingProductsService.getMissingProductsStats();
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Productos perdidos por rango de fechas' })
  @ApiQuery({ name: 'startDate', required: true, example: '01-01-2023' })
  @ApiQuery({ name: 'endDate', required: true, example: '31-12-2023' })
  findByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.missingProductsService.findByDateRange(startDate, endDate);
  }

  @Post('return')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registrar la devolución de un producto faltante' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Devolución registrada exitosamente',
    schema: {
      example: {
        message: 'Se devolvieron 1 unidades del producto Bolsa de Cemento 42.5 Kg',
        remainingMissing: 1,
        shift: {
          id: 12,
          start: '31-03-2025 11:10:02',
          end: null,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No se encontró una pérdida registrada para este producto y empleado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o intentó devolver más de lo permitido',
  })
  async returnMissingProduct(@Body() returnDto: ReturnMissingProductDto) {
    return this.missingProductsService.returnMissingProduct(
      returnDto.employeeId,
      returnDto.productId,
      returnDto.quantityReturned,
    );
  }

}
