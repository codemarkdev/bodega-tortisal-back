import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ToolsIssued } from './entities/tools-issued.entity';
import { Product } from '../products/entities/product.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { ToolsByEmployeeShiftResponseDto } from './dto/tools-by-employee-shift.dto';
import { MissingProduct } from 'src/missing-products/entities/missing-product.entity';

@Injectable()
export class ToolsIssuedService {
  constructor(
    @InjectRepository(ToolsIssued)
    private toolsIssuedRepository: Repository<ToolsIssued>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
    @InjectRepository(MissingProduct)
    private readonly missingProductRepository: Repository<MissingProduct>
  ) {}

  async registerMultipleToolsIssue(
    shiftId: number,
    products: { productId: number; quantity: number }[]
  ) {
    
    // 🔹 Verificar que shiftId es un número válido
    if (isNaN(shiftId)) {
      throw new HttpException('ID de turno no válido', HttpStatus.BAD_REQUEST);
    }
  
    // 🔹 Buscar el turno
    const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
    if (!shift) {
      throw new HttpException('Turno no encontrado', HttpStatus.NOT_FOUND);
    }
  
    // 🔹 Verificar si el turno está cerrado
    if (shift.check_out_time != null) {
      throw new HttpException('No se pueden prestar herramientas a un turno cerrado', HttpStatus.FORBIDDEN);
    }
  
    const issuedTools: ToolsIssued[] = [];
  
    for (const item of products) {
      const product = await this.validateProduct(item.productId, item.quantity);
      if (!product) {
        throw new HttpException(`Producto con ID ${item.productId} no encontrado`, HttpStatus.NOT_FOUND);
      }
  
      if (product.quantity < item.quantity) {
        throw new HttpException(`Stock insuficiente para el producto con ID ${item.productId}`, HttpStatus.BAD_REQUEST);
      }

      let existingTool = await this.toolsIssuedRepository.findOne({
        where: {
          shift: { id: shiftId },
          product: { id: item.productId }
        }
      })

      // Acumular cantidad si ya se presto la herramienta

      if (existingTool) {
        existingTool.quantity_issued += item.quantity;
        await this.toolsIssuedRepository.save(existingTool);
        issuedTools.push(existingTool);
      } else { 

        // Crear nuevo registro si no se ha prestado

      const toolIssued = this.toolsIssuedRepository.create({
        shift: { id: shiftId },
        product: { id: item.productId },
        quantity_issued: item.quantity,
      });

      // 🔹 Guardar la herramienta prestada en la base de datos
      const savedToolIssued = await this.toolsIssuedRepository.save(toolIssued);
      
      issuedTools.push(savedToolIssued);
      
      }
  
      // 🔹 Actualizar stock
      product.quantity -= item.quantity;
      await this.productRepository.save(product);
  
    }
  
    return issuedTools;
  }
  
  
  

  async registerMultipleToolsReturn(
    shiftId: number,
    products: { productId: number; quantityReturned: number }[],
  ) {
    if (isNaN(shiftId)) {
      throw new HttpException('ID de turno no válido', HttpStatus.BAD_REQUEST);
    }
  
    // 🔹 Verificar si el turno está cerrado
    const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
    if (!shift) {
      throw new HttpException('Turno no encontrado', HttpStatus.NOT_FOUND);
    }
    if (shift.check_out_time != null) {
      throw new HttpException('No se pueden devolver herramientas de un turno cerrado', HttpStatus.FORBIDDEN);
    }
  
    const toolsIssued = await this.toolsIssuedRepository.find({
      where: {
        shift: { id: shiftId },
        product: { id: In(products.map((item) => item.productId)) },
      },
      relations: ['product', 'shift', 'missingProducts'],
    });
  
    if (!toolsIssued || toolsIssued.length === 0) {
      throw new HttpException(
        'No se encontraron préstamos para este turno y productos',
        HttpStatus.NOT_FOUND,
      );
    }
  
    const returnedTools: ToolsIssued[] = [];
  
    for (const item of products) {
      const toolIssued = toolsIssued.find((tool) => tool.product.id === item.productId);
  
      if (!toolIssued) {
        throw new HttpException(
          `No se encontró préstamo para el producto con ID ${item.productId}`,
          HttpStatus.NOT_FOUND,
        );
      }
  
      // Calcular total devuelto incluyendo devoluciones previas
      const totalReturned = (toolIssued.quantity_returned || 0) + item.quantityReturned;
  
      if (totalReturned > toolIssued.quantity_issued) {
        throw new HttpException(
          `Cantidad devuelta excede lo prestado para el producto con ID ${item.productId} (${toolIssued.quantity_issued})`,
          HttpStatus.BAD_REQUEST,
        );
      }
  
      // Actualizar cantidad devuelta
      toolIssued.quantity_returned = totalReturned;
      await this.toolsIssuedRepository.save(toolIssued);
  
      // Actualizar stock si no es consumible
      if (!toolIssued.product.is_consumable) {
        throw new HttpException(
          `Los productos consumibles (${toolIssued.product.name}) no pueden ser devueltos!`,
          HttpStatus.BAD_REQUEST
        )
      }
  
      // **Registrar o actualizar pérdida**
      const missingQuantity = toolIssued.quantity_issued - totalReturned;
      let existingMissingRecord = toolIssued.missingProducts?.[0];
  
      if (missingQuantity > 0) {
        if (existingMissingRecord) {
          existingMissingRecord.missing_quantity = missingQuantity;
          await this.missingProductRepository.save(existingMissingRecord);
        } else {
          const newMissingProduct = this.missingProductRepository.create({
            shift: toolIssued.shift,
            product: toolIssued.product,
            toolsIssued: toolIssued,
            missing_quantity: missingQuantity,
          });
          await this.missingProductRepository.save(newMissingProduct);
        }
      } else if (existingMissingRecord) {
        // Si ya no hay pérdidas, eliminamos el registro de missing_products
        await this.missingProductRepository.remove(existingMissingRecord);
      }
  
      returnedTools.push(toolIssued);
    }
  
    return returnedTools;
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
    if (tool.product.is_consumable) return 'CONSUMIBLE'
    if (tool.quantity_returned === null) return 'PENDIENTE';
    if (tool.quantity_returned === tool.quantity_issued) return 'COMPLETO';
    if ((tool.quantity_returned + (tool.missingProducts?.reduce((sum, mp) => sum + mp.missing_quantity, 0) || 0)) 
      === tool.quantity_issued) return 'CON_FALTANTES';
    return 'PARCIAL';
  }
}