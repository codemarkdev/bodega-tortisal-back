import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>

  ){}

  async create(createEmployeeDto: CreateEmployeeDto) {
    
    const employee = await this.employeeRepository.create(createEmployeeDto);

    return this.employeeRepository.save(employee);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const [ data, total ] = await this.employeeRepository.findAndCount({
      take: Number(limit),
      skip: Number(( page - 1 )) * Number( limit ),
    })
   
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({where: {id: id}})

    if (!employee) throw new HttpException(`El empleado con el ID: ${id} no existe!`, HttpStatus.NOT_FOUND);

    return employee
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    Object.assign(employee, updateEmployeeDto);

    return this.employeeRepository.save(employee);
  }

  async remove(id: number) {
   const employee = await this.findOne(id);

   return this.employeeRepository.remove(employee);

  }
}
