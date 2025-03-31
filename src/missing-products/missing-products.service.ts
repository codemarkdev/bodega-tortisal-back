import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import * as moment from 'moment-timezone';
import { MissingProduct } from './entities/missing-product.entity';
import { Shift } from '../shifts/entities/shift.entity';

@Injectable()
export class MissingProductsService {
  constructor(
    @InjectRepository(MissingProduct)
    private readonly missingProductRepository: Repository<MissingProduct>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  // Obtener todos los productos perdidos con relaciones
  async findAll(): Promise<MissingProduct[]> {
    return await this.missingProductRepository.find({
      relations: ['shift', 'shift.employee', 'product', 'toolsIssued'],
      order: { id: 'DESC' }
    });
  }

  // Obtener productos perdidos por turno específico
  async findByShift(shiftId: number): Promise<MissingProduct[]> {
    return await this.missingProductRepository.find({
      where: { shift: { id: shiftId } },
      relations: ['product', 'toolsIssued', 'shift.employee'],
    });
  }

  // Producto más perdido (por cantidad total)
  async getMostMissingProduct(): Promise<{product: any, totalMissing: number}> {
    const result = await this.missingProductRepository
      .createQueryBuilder('mp')
      .select(['product.id', 'product.name', 'SUM(mp.missing_quantity) as totalMissing'])
      .leftJoin('mp.product', 'product')
      .groupBy('product.id, product.name')
      .orderBy('totalMissing', 'DESC')
      .limit(1)
      .getRawOne();

    return {
      product: {
        id: result.product_id,
        name: result.product_name
      },
      totalMissing: parseInt(result.totalMissing)
    };
  }

  // Empleado con más productos perdidos
  async getEmployeeWithMostMissingProducts(): Promise<{employee: any, totalMissing: number}> {
    const result = await this.missingProductRepository
      .createQueryBuilder('mp')
      .select(['employee.id', 'employee.firstname', 'SUM(mp.missing_quantity) as totalMissing'])
      .leftJoin('mp.shift', 'shift')
      .leftJoin('shift.employee', 'employee')
      .groupBy('employee.id, employee.firstname')
      .orderBy('totalMissing', 'DESC')
      .limit(1)
      .getRawOne();

    return {
      employee: {
        id: result.employee_id,
        name: result.employee_firstname
      },
      totalMissing: parseInt(result.totalMissing)
    };
  }

  // Pérdida económica total
  async getTotalFinancialLoss(): Promise<{totalLoss: number}> {
    const result = await this.missingProductRepository
      .createQueryBuilder('mp')
      .select('SUM(product.purchase_price * mp.missing_quantity)', 'totalLoss')
      .leftJoin('mp.product', 'product')
      .getRawOne();

    return {
      totalLoss: parseFloat(result.totalLoss) || 0
    };
  }

  async findByEmployee(employeeId: number): Promise<MissingProduct[]> {
    return await this.missingProductRepository.find({
      where: {
        shift: {
          employee: { id: employeeId }
        }
      },
      relations: ['shift', 'shift.employee', 'product'],
      order: { shift: { check_in_time: 'DESC' } }
    });
  }
  
  async findByEmployeeAndDateRange(employeeId: number, startDate: string, endDate: string): Promise<MissingProduct[]> {
    const start = moment(startDate, 'DD-MM-YYYY').startOf('day').toDate();
    const end = moment(endDate, 'DD-MM-YYYY').endOf('day').toDate();
  
    return await this.missingProductRepository.find({
      where: {
        shift: {
          employee: { id: employeeId },
          check_in_time: Between(start.toISOString(), end.toISOString())
        }
      },
      relations: ['shift', 'shift.employee', 'product'],
      order: { shift: { check_in_time: 'DESC' } }
    });
  }
  

  // Estadísticas completas
  async getMissingProductsStats() {
    const [mostMissingProduct, worstEmployee, totalLoss] = await Promise.all([
      this.getMostMissingProduct(),
      this.getEmployeeWithMostMissingProducts(),
      this.getTotalFinancialLoss()
    ]);

    return {
      mostMissingProduct,
      worstEmployee,
      totalLoss,
      lastUpdated: moment().format('DD-MM-YYYY HH:mm:ss')
    };
  }

  // Productos perdidos por rango de fechas
  async findByDateRange(startDate: string, endDate: string): Promise<MissingProduct[]> {
    const start = moment(startDate, 'DD-MM-YYYY').startOf('day').toDate();
    const end = moment(endDate, 'DD-MM-YYYY').endOf('day').toDate();

    return await this.missingProductRepository.find({
      where: {
        shift: {
          check_in_time: Between(start.toISOString(), end.toISOString())
        }
      },
      relations: ['shift', 'shift.employee', 'product'],
      order: { shift: { check_in_time: 'DESC' } }
    });
  }
}