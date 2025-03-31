import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Shift } from './entities/shift.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class ShiftsService {
  private readonly timezone = 'America/El_Salvador';
  private readonly dateFormat = 'DD-MM-YYYY HH:mm:ss';

  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createShiftDto: CreateShiftDto): Promise<Shift> {
    const employee = await this.employeeRepository.findOne({
      where: { id: createShiftDto.id_employee }
    });
  
    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${createShiftDto.id_employee} no encontrado`);
    }

    // Verificar que no tenga turnos hoy (abiertos o cerrados)
    const today = moment().tz(this.timezone).format('DD-MM-YYYY');
    const hasShiftToday = await this.hasShiftOnDate(employee.id, today);

    if (hasShiftToday) {
      throw new HttpException(
        'El empleado ya tiene un turno registrado hoy',
        HttpStatus.BAD_REQUEST
      );
    }

    // Crear nuevo turno
    const shift = this.shiftRepository.create({
      employee,
      check_in_time: moment().tz(this.timezone).format(this.dateFormat),
    });
  
    return await this.shiftRepository.save(shift);
  }

  private async hasShiftOnDate(employeeId: number, dateString: string): Promise<boolean> {
    const date = moment(dateString, 'DD-MM-YYYY').tz(this.timezone);
    const startOfDay = date.startOf('day').format(this.dateFormat);
    const endOfDay = date.endOf('day').format(this.dateFormat);

    const count = await this.shiftRepository.count({
      where: {
        employee: { id: employeeId },
        check_in_time: Between(startOfDay, endOfDay)
      }
    });

    return count > 0;
  }

  async getTodayShift(employeeId: number): Promise<Shift | null> {
    const today = moment().tz(this.timezone).format('DD-MM-YYYY');
    const startOfDay = moment(today, 'DD-MM-YYYY').startOf('day').format(this.dateFormat);
    const endOfDay = moment(today, 'DD-MM-YYYY').endOf('day').format(this.dateFormat);

    return await this.shiftRepository.findOne({
      where: {
        employee: { id: employeeId },
        check_in_time: Between(startOfDay, endOfDay)
      },
      relations: ['employee'],
      order: { check_in_time: 'DESC' }
    });
  }

  async closeShift(employeeId: number): Promise<Shift> {
    const shift = await this.getTodayShift(employeeId);
    
    if (!shift) {
      throw new HttpException(
        'No se encontró un turno para este empleado hoy',
        HttpStatus.NOT_FOUND
      );
    }

    if (shift.check_out_time) {
      throw new HttpException(
        'El turno ya está cerrado',
        HttpStatus.BAD_REQUEST
      );
    }

    shift.check_out_time = moment()
      .tz(this.timezone)
      .format(this.dateFormat);
  
    return await this.shiftRepository.save(shift);
  }

  private async getActiveShift(employeeId: number): Promise<Shift> {
    const todayShifts = await this.getShiftsForEmployee(employeeId);
    const activeShift = todayShifts.find(shift => !shift.check_out_time);

    if (!activeShift) {
      throw new HttpException(
        'No se encontró un turno activo para este empleado hoy',
        HttpStatus.NOT_FOUND
      );
    }

    return activeShift;
  }

  async getShiftsForEmployee(
    employeeId: number, 
    date?: string
  ): Promise<Shift[]> {
    const targetDate = date 
      ? moment(date, this.dateFormat).tz(this.timezone)
      : moment().tz(this.timezone);
  
    const startOfDay = targetDate.startOf('day').format(this.dateFormat);
    const endOfDay = targetDate.endOf('day').format(this.dateFormat);
  
    return this.shiftRepository.find({
      where: {
        employee: { id: employeeId },
        check_in_time: Between(startOfDay, endOfDay),
      },
      relations: ['employee'],
      order: { check_in_time: 'DESC' }
    });
  }


  async findAll(date?: string, page: number = 1, limit: number = 10): Promise<{ data: Shift[], total: number }> {
    const whereCondition: any = {};
  
    if (date) {
      const dateMoment = moment(date, 'DD-MM-YYYY').tz(this.timezone);
      const startOfDay = dateMoment.startOf('day').format(this.dateFormat);
      const endOfDay = dateMoment.endOf('day').format(this.dateFormat);
      whereCondition.check_in_time = Between(startOfDay, endOfDay);
    }
  
    const [data, total] = await this.shiftRepository.findAndCount({
      where: whereCondition,
      relations: ['employee'],
      order: { check_in_time: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
  
    return { data, total };
  }
  

  async getEmployeeShiftsHistory(
    employeeId: number,
    startDate?: string,
    endDate?: string
  ): Promise<Shift[]> {
    // Validar que el empleado exista
    const employee = await this.employeeRepository.findOne({ 
      where: { id: employeeId } 
    });
    
    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${employeeId} no encontrado`);
    }
  
    const whereCondition: any = {
      employee: { id: employeeId }
    };
  
    // Si se proporcionan fechas, filtrar por rango
    if (startDate || endDate) {
      const start = startDate 
        ? moment(startDate, 'DD-MM-YYYY').tz(this.timezone).startOf('day').format(this.dateFormat)
        : moment().tz(this.timezone).startOf('day').subtract(1, 'month').format(this.dateFormat);
      
      const end = endDate
        ? moment(endDate, 'DD-MM-YYYY').tz(this.timezone).endOf('day').format(this.dateFormat)
        : moment().tz(this.timezone).endOf('day').format(this.dateFormat);
  
      whereCondition.check_in_time = Between(start, end);
    }
  
    return await this.shiftRepository.find({
      where: whereCondition,
      relations: ['employee'],
      order: { check_in_time: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!shift) {
      throw new NotFoundException(`El turno con ID ${id} no existe`);
    }

    return shift;
  }

  async updateShiftByEmployee(updateShiftDto: UpdateShiftDto): Promise<Shift> {
    // 1. Obtener el turno activo más reciente del empleado
    const activeShift = await this.getCurrentShift(updateShiftDto.employeeId);

    // 2. Registrar hora de salida
    activeShift.check_out_time = moment()
      .tz('America/El_Salvador')
      .format('DD-MM-YYYY HH:mm:ss');
  
    return await this.shiftRepository.save(activeShift);
  }

  async remove(id: number): Promise<Shift> {
    const shift = await this.findOne(id);
    return await this.shiftRepository.remove(shift);
  }

  private async getCurrentShift(employeeId: number): Promise<Shift> {
    // Obtener el turno más reciente sin cerrar
    const todayShifts = await this.getShiftsForEmployee(employeeId);
    const activeShift = todayShifts.find(shift => !shift.check_out_time);

    if (!activeShift) {
      throw new HttpException(
        'No se encontró un turno activo para este empleado hoy',
        HttpStatus.NOT_FOUND,
      );
    }

    return activeShift;
  }

  async getEmployeeActiveShift(employeeId: number): Promise<Shift | null> {
    try {
      return await this.getCurrentShift(employeeId);
    } catch (error) {
      return null;
    }
  }
}