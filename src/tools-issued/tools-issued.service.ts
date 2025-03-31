import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ToolsIssued } from './entities/tools-issued.entity';
import { Product } from '../products/entities/product.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { ToolsByEmployeeShiftResponseDto } from './dto/tools-by-employee-shift.dto';

@Injectable()
export class ToolsIssuedService {
  constructor(
    @InjectRepository(ToolsIssued)
    private toolsIssuedRepository: Repository<ToolsIssued>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
  ) {}

  async registerToolsIssue(shiftId: number, productId: number, quantity: number) {
    // Validar turno
    const shift = await this.validateShift(shiftId);
    
    // Validar producto
    const product = await this.validateProduct(productId, quantity);

    // Crear registro
    const toolIssued = this.toolsIssuedRepository.create({
      shift: { id: shiftId },
      product: { id: productId },
      quantity_issued: quantity
    });

    // Actualizar stock
    product.quantity -= quantity;
    await this.productRepository.save(product);

    return await this.toolsIssuedRepository.save(toolIssued);
  }

  async registerToolsReturn(shiftId: number, productId: number, quantityReturned: number) {
    // Obtener el préstamo
    const toolIssued = await this.toolsIssuedRepository.findOne({
      where: { 
        shift: { id: shiftId },
        product: { id: productId }
      },
      relations: ['product', 'shift']
    });

    if (!toolIssued) {
      throw new HttpException('No se encontró préstamo para este producto', HttpStatus.NOT_FOUND);
    }

    // Validar cantidad
    if (quantityReturned > toolIssued.quantity_issued) {
      throw new HttpException(
        `Cantidad devuelta excede lo prestado (${toolIssued.quantity_issued})`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Actualizar registro
    toolIssued.quantity_returned = quantityReturned;
    await this.toolsIssuedRepository.save(toolIssued);

    // Manejar stock y faltantes
    if (!toolIssued.product.is_consumable) {
      toolIssued.product.quantity += quantityReturned;
      await this.productRepository.save(toolIssued.product);
    }

    return toolIssued;
  }

  async getToolsByShift(shiftId: number) {
    const tools = await this.toolsIssuedRepository.find({
      where: { shift: { id: shiftId } },
      relations: ['product', 'missingProducts'],
    });

    return {
      shiftId,
      tools: tools.map(tool => ({
        id: tool.id,
        product: {
          id: tool.product.id,
          name: tool.product.name,
          isConsumable: tool.product.is_consumable
        },
        issued: tool.quantity_issued,
        returned: tool.quantity_returned,
        missing: tool.missingProducts?.reduce((sum, mp) => sum + mp.missing_quantity, 0) || 0
      }))
    };
  }

  // Métodos auxiliares
  private async validateShift(shiftId: number) {
    const shift = await this.shiftRepository.findOne({ 
      where: { id: shiftId },
      relations: ['employee']
    });

    if (!shift) {
      throw new HttpException('Turno no encontrado', HttpStatus.NOT_FOUND);
    }

    if (shift.check_out_time) {
      throw new HttpException(
        'No se pueden prestar herramientas en un turno cerrado',
        HttpStatus.BAD_REQUEST
      );
    }

    return shift;
  }

  private async validateProduct(productId: number, quantity: number) {
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }

    if (product.quantity < quantity) {
      throw new HttpException(
        `Stock insuficiente. Disponible: ${product.quantity}`,
        HttpStatus.BAD_REQUEST
      );
    }

    return product;
  }

  async getToolsByEmployeeAndShift(
    employeeId: number, 
    shiftId: number
  ): Promise<ToolsByEmployeeShiftResponseDto> {
    // 1. Validar que el turno pertenece al empleado
    const shift = await this.shiftRepository.findOne({
      where: { id: shiftId, employee: { id: employeeId } },
      relations: ['employee', 'toolsIssued', 'toolsIssued.product', 'toolsIssued.missingProducts'],
    });

    if (!shift) {
      throw new HttpException(
        'No se encontró el turno para este empleado',
        HttpStatus.NOT_FOUND
      );
    }

    // 2. Procesar las herramientas
    const tools = shift.toolsIssued.map(tool => ({
      id: tool.id,
      product: {
        id: tool.product.id,
        name: tool.product.name,
        description: tool.product.description,
        isConsumable: tool.product.is_consumable,
      },
      issued: tool.quantity_issued,
      returned: tool.quantity_returned,
      missing: tool.missingProducts?.reduce((sum, mp) => sum + mp.missing_quantity, 0) || 0,
      status: this.getToolStatus(tool),
    }));

    // 3. Calcular resumen
    const summary = {
      totalTools: tools.length,
      totalIssued: tools.reduce((sum, tool) => sum + tool.issued, 0),
      totalReturned: tools.reduce((sum, tool) => sum + (tool.returned || 0), 0),
      totalMissing: tools.reduce((sum, tool) => sum + tool.missing, 0),
      pending: tools.reduce((sum, tool) => {
        const pending = tool.issued - (tool.returned || 0) - tool.missing;
        return sum + (pending > 0 ? pending : 0);
      }, 0),
    };

    // 4. Construir respuesta
    return {
      employeeId: shift.employee.id,
      employeeName: `${shift.employee.firstname} ${shift.employee.lastname}`,
      shiftId: shift.id,
      shiftStart: shift.check_in_time,
      shiftEnd: shift.check_out_time || null,
      tools,
      summary,
    };
  }

  private getToolStatus(tool: ToolsIssued): string {
    if (tool.quantity_returned === null) return 'PENDIENTE';
    if (tool.quantity_returned === tool.quantity_issued) return 'COMPLETO';
    if ((tool.quantity_returned + (tool.missingProducts?.reduce((sum, mp) => sum + mp.missing_quantity, 0) || 0)) 
      === tool.quantity_issued) return 'CON_FALTANTES';
    return 'PARCIAL';
  }
}