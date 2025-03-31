import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Shift } from './entities/shift.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Employee } from 'src/employees/entities/employee.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createShiftDto: CreateShiftDto) {
    const checkInTime = moment().tz('America/El_Salvador').format('DD-MM-YYYY HH:mm:ss'); // Convertir a UTC antes de guardar
  
    const employee = await this.employeeRepository.findOne({
      where: { id: createShiftDto.id_employee }
    });
  
    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${createShiftDto.id_employee} no encontrado`);
    }
  
    const shift = this.shiftRepository.create({
      employee,
      check_in_time: checkInTime, // Fecha en UTC
    });
  
    return await this.shiftRepository.save(shift);
  }
  

  async findAll() {
    return await this.shiftRepository.find({ relations: ['employee'] });
  }

  async findOne(id: number) {
    const shift = await this.shiftRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!shift) throw new NotFoundException(`El turno con ID ${id} no existe`);

    return shift;
  }

  async updateShiftByEmployee(updateShiftDto: UpdateShiftDto) {
    // 1. Obtener fecha actual en El Salvador (inicio y fin del día)
    const todayStart = moment().tz('America/El_Salvador').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const todayEnd = moment().tz('America/El_Salvador').endOf('day').format('YYYY-MM-DD HH:mm:ss');
  
    // 2. Buscar turno activo (sin hora de salida y del día actual)
    const activeShift = await this.shiftRepository.findOne(
      {where: {
      employee: {id: updateShiftDto.employeeId},
    },
    relations: ['employee']
  });
  
    if (!activeShift) {
      throw new HttpException(
        'No se encontró un turno activo para este empleado hoy',
        HttpStatus.NOT_FOUND,
      );
    }
  
    // 3. Registrar hora de salida (formato DD-MM-YYYY HH:mm:ss)
    activeShift.check_out_time = moment()
      .tz('America/El_Salvador')
      .format('DD-MM-YYYY HH:mm:ss');
  
    return await this.shiftRepository.save(activeShift);
  }

  async remove(id: number) {
    const shift = await this.findOne(id);
    return await this.shiftRepository.remove(shift);
  }

  async getShiftsForEmployee(employeeId: number, date?: string): Promise<Shift[]> {
    // 1. Obtener la fecha objetivo en formato local (El Salvador)
    const targetDate = date 
      ? moment(date, 'DD-MM-YYYY HH:mm:ss').tz('America/El_Salvador') 
      : moment().tz('America/El_Salvador');
  
    // 2. Definir rangos del día en formato string (DD-MM-YYYY HH:mm:ss)
    const startOfDay = targetDate.startOf('day').format('DD-MM-YYYY HH:mm:ss');
    const endOfDay = targetDate.endOf('day').format('DD-MM-YYYY HH:mm:ss');
  
    // 3. Buscar turnos donde check_in_time esté entre las fechas locales
    return this.shiftRepository.find({
      where: {
        employee: { id: employeeId },
        check_in_time: Between(startOfDay, endOfDay), // Comparación como strings
      },
      relations: ['employee'],
    });
  }
}
