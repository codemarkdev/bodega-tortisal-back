// missing-products.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import * as moment from 'moment-timezone';
import { MissingProduct } from './entities/missing-product.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class MissingProductsService {
  constructor(
    @InjectRepository(MissingProduct)
    private readonly missingProductRepository: Repository<MissingProduct>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<MissingProduct[]> {
    return await this.missingProductRepository.find({
      relations: ['shift', 'shift.employee', 'product', 'toolsIssued'],
      order: { id: 'DESC' },
    });
  }

  async findByShift(shiftId: number): Promise<MissingProduct[]> {
    return await this.missingProductRepository.find({
      where: { shift: { id: shiftId } },
      relations: ['product', 'toolsIssued', 'shift.employee'],
    });
  }

  async getMostMissingProduct(): Promise<{ product: any; totalMissing: number }> {
    const result = await this.missingProductRepository
      .createQueryBuilder('mp')
      .select(['product.id', 'product.name', 'SUM(mp.missing_quantity) as totalMissing'])
      .leftJoin('mp.product', 'product')
      .groupBy('product.id, product.name')
      .orderBy('totalMissing', 'DESC')
      .limit(1)
      .getRawOne();

    return result
      ? {
          product: { id: result.product_id, name: result.product_name },
          totalMissing: parseInt(result.totalMissing),
        }
      :  {
        product: { id: 0, name: 'No data' },
        totalMissing: 0,
      };
  }

  async returnMissingProduct(employeeId: number, productId: number, quantityReturned: number) {
    if (!employeeId || !productId || quantityReturned <= 0) {
      throw new HttpException('Datos inválidos', HttpStatus.BAD_REQUEST);
    }

    // Buscar el producto perdido por turno
    const missingProduct = await this.missingProductRepository.findOne({
      where: {
        shift: { employee: { id: employeeId } },
        product: { id: productId },
      },
      relations: ['shift', 'product', 'toolsIssued'],
    });

    if (!missingProduct) {
      throw new HttpException('No se encontró una pérdida registrada para este producto y empleado', HttpStatus.NOT_FOUND);
    }

    if (missingProduct.missing_quantity === 0) {
      throw new HttpException('No hay productos pendientes de devolución', HttpStatus.BAD_REQUEST);
    }

    // Validar que no se devuelva más de lo que se perdió
    if (quantityReturned > missingProduct.missing_quantity) {
      throw new HttpException(
        `No puedes devolver más de lo que se reportó como perdido (${missingProduct.missing_quantity})`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Restar cantidad devuelta a la cantidad faltante
    missingProduct.missing_quantity -= quantityReturned;

    // Si ya no hay productos pendientes, eliminar el registro
    if (missingProduct.missing_quantity === 0) {
      await this.missingProductRepository.remove(missingProduct);
    } else {
      await this.missingProductRepository.save(missingProduct);
    }

    // Actualizar stock si el producto no es consumible
    if (!missingProduct.product.is_consumable) {
      missingProduct.product.quantity += quantityReturned;
      await this.productRepository.save(missingProduct.product);
    }

    return {
      message: `Se devolvieron ${quantityReturned} unidades del producto ${missingProduct.product.name}`,
      remainingMissing: missingProduct.missing_quantity,
      shift: {
        id: missingProduct.shift.id,
        start: missingProduct.shift.check_in_time,
        end: missingProduct.shift.check_out_time,
      },
    };
  }
  

  async getEmployeeWithMostMissingProducts(): Promise<{ employee: any; totalMissing: number }> {
    const result = await this.missingProductRepository
      .createQueryBuilder('mp')
      .select(['employee.id', 'employee.firstname', 'SUM(mp.missing_quantity) as totalMissing'])
      .leftJoin('mp.shift', 'shift')
      .leftJoin('shift.employee', 'employee')
      .groupBy('employee.id, employee.firstname')
      .orderBy('totalMissing', 'DESC')
      .limit(1)
      .getRawOne();

    return result
      ? {
          employee: { id: result.employee_id, name: result.employee_firstname },
          totalMissing: parseInt(result.totalMissing),
        }
      : {
        employee: { id: 0, name: 'No data' },
        totalMissing: 0,
      };
  }

  async getTotalFinancialLoss(): Promise<{ totalLoss: number }> {
    const result = await this.missingProductRepository
      .createQueryBuilder('mp')
      .select('SUM(product.purchase_price * mp.missing_quantity)', 'totalLoss')
      .leftJoin('mp.product', 'product')
      .getRawOne();

    return { totalLoss: parseFloat(result.totalLoss) || 0 };
  }

  async findByEmployee(employeeId: number): Promise<MissingProduct[]> {
    return await this.missingProductRepository.find({
      where: { shift: { employee: { id: employeeId } } },
      relations: ['shift', 'shift.employee', 'product'],
      order: { shift: { check_in_time: 'DESC' } },
    });
  }

  async findByEmployeeAndDateRange(employeeId: number, startDate: string, endDate: string): Promise<MissingProduct[]> {
    const start = moment(startDate, 'DD-MM-YYYY').startOf('day').toDate();
    const end = moment(endDate, 'DD-MM-YYYY').endOf('day').toDate();

    return await this.missingProductRepository.find({
      where: { shift: { employee: { id: employeeId }, check_in_time: Between(start.toISOString(), end.toISOString()) } },
      relations: ['shift', 'shift.employee', 'product'],
      order: { shift: { check_in_time: 'DESC' } },
    });
  }

  async findByDateRange(startDate: string, endDate: string): Promise<MissingProduct[]> {
    const start = moment(startDate, 'DD-MM-YYYY').startOf('day').toDate();
    const end = moment(endDate, 'DD-MM-YYYY').endOf('day').toDate();

    return await this.missingProductRepository.find({
      where: { shift: { check_in_time: Between(start.toISOString(), end.toISOString()) } },
      relations: ['shift', 'shift.employee', 'product'],
      order: { shift: { check_in_time: 'DESC' } },
    });
  }

  async getMissingProductsStats() {
    const [mostMissingProduct, worstEmployee, totalLoss] = await Promise.all([
      this.getMostMissingProduct(),
      this.getEmployeeWithMostMissingProducts(),
      this.getTotalFinancialLoss(),
    ]);

    return {
      mostMissingProduct,
      worstEmployee,
      totalLoss,
      lastUpdated: moment().format('DD-MM-YYYY HH:mm:ss'),
    };
  }
}
